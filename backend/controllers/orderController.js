const pool = require("../config/db");
const { sendOrderConfirmation } = require("../utils/mailer");

exports.getOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id, o.status, o.shipping_address, o.total_amount, o.currency,
        o.created_at, o.updated_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'product_name', p.name,
              'image_url', (
                SELECT pi.image_url FROM product_images pi
                WHERE pi.product_id = p.id
                ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
                LIMIT 1
              )
            ) ORDER BY oi.id
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON p.id = oi.product_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return res.json({ orders: result.rows });
  } catch (err) {
    console.error("GET /api/orders failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

function toPositiveInt(value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

exports.placeOrder = async (req, res) => {
  const shippingAddress = req.body?.shipping_address;
  const items = req.body?.items ?? req.body?.cart_items;

  if (!shippingAddress || typeof shippingAddress !== "object") {
    return res.status(400).json({ message: "shipping_address is required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "cart items are required" });
  }

  const normalized = [];
  for (const raw of items) {
    const productId = toPositiveInt(raw?.product_id);
    const quantity = toPositiveInt(raw?.quantity);
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Each cart item must include product_id and quantity" });
    }
    normalized.push({ productId, quantity });
  }

  // Merge duplicates (same product_id)
  const mergedMap = new Map();
  for (const i of normalized) {
    mergedMap.set(i.productId, (mergedMap.get(i.productId) ?? 0) + i.quantity);
  }
  const merged = Array.from(mergedMap.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productIds = merged.map((i) => i.productId);
    const productsQuery = `
      SELECT id, price
      FROM products
      WHERE id = ANY($1::bigint[])
    `;
    const productsResult = await client.query(productsQuery, [productIds]);

    if (productsResult.rowCount !== productIds.length) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "One or more products not found" });
    }

    const priceById = new Map(
      productsResult.rows.map((r) => [Number(r.id), r.price])
    );

    let totalAmount = 0;
    const orderItems = merged.map((i) => {
      const unitPrice = priceById.get(i.productId);
      totalAmount += Number(unitPrice) * i.quantity;
      return { ...i, unitPrice };
    });

    const orderInsert = `
      INSERT INTO orders (status, shipping_address, total_amount, currency, updated_at)
      VALUES ('pending', $1::jsonb, $2, 'INR', NOW())
      RETURNING id, status, shipping_address, total_amount, currency, created_at, updated_at
    `;
    const orderResult = await client.query(orderInsert, [
      JSON.stringify(shippingAddress),
      totalAmount.toFixed(2),
    ]);
    const order = orderResult.rows[0];

    const values = [];
    const placeholders = [];
    let idx = 1;
    for (const oi of orderItems) {
      values.push(order.id, oi.productId, oi.quantity, oi.unitPrice);
      placeholders.push(
        `($${idx++}, $${idx++}, $${idx++}, $${idx++})`
      );
    }

    const orderItemsInsert = `
      INSERT INTO order_items (order_id, product_id, quantity, unit_price)
      VALUES ${placeholders.join(", ")}
      RETURNING id, order_id, product_id, quantity, unit_price, created_at
    `;
    const orderItemsResult = await client.query(orderItemsInsert, values);

    await client.query("COMMIT");

    // Send order confirmation email (non-blocking)
    if (req.user?.email) {
      const itemsWithNames = await pool.query(
        `SELECT oi.product_id, oi.quantity, oi.unit_price, p.name AS product_name
         FROM order_items oi JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      sendOrderConfirmation({
        to: req.user.email,
        orderId: order.id,
        totalAmount: order.total_amount,
        items: itemsWithNames.rows,
      }).catch(() => {});
    }

    return res.status(201).json({
      order,
      items: orderItemsResult.rows,
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (_) {
      // ignore rollback errors
    }
    // eslint-disable-next-line no-console
    console.error("POST /api/orders failed:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

exports.cancelOrder = async (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isFinite(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  try {
    const result = await pool.query(
      `UPDATE orders
       SET status = 'cancelled', updated_at = NOW()
       WHERE id = $1 AND status IN ('pending', 'confirmed')
       RETURNING id, status, updated_at`,
      [orderId]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Order cannot be cancelled. Only pending or confirmed orders can be cancelled.",
      });
    }
    return res.json({ order: result.rows[0] });
  } catch (err) {
    console.error("PATCH /api/orders/:id/cancel failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.returnOrder = async (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isFinite(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order ID" });
  }
  try {
    const result = await pool.query(
      `UPDATE orders
       SET status = 'return_requested', updated_at = NOW()
       WHERE id = $1 AND status = 'delivered'
       RETURNING id, status, updated_at`,
      [orderId]
    );
    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Only delivered orders can be returned.",
      });
    }
    return res.json({ order: result.rows[0] });
  } catch (err) {
    console.error("PATCH /api/orders/:id/return failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


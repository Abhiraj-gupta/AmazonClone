const pool = require("../config/db");

function getCartId(req) {
  const headerValue = req.header("x-cart-id");
  const queryValue = req.query.cart_id;
  const cartId = (headerValue ?? queryValue ?? "guest").toString().trim();
  return cartId || "guest";
}

function toPositiveInt(value) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

exports.getCart = async (req, res) => {
  try {
    const cartId = getCartId(req);

    const query = `
      SELECT
        ci.id,
        ci.cart_id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        ci.updated_at,
        p.name,
        p.description,
        p.price,
        p.stock,
        COALESCE(
          (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.id
            ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
            LIMIT 1
          ),
          NULL
        ) AS image_url
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at DESC, ci.id DESC
    `;

    const result = await pool.query(query, [cartId]);
    return res.json({ cartId, items: result.rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("GET /api/cart failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.addCartItem = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const productId = toPositiveInt(req.body?.product_id);
    const quantity = toPositiveInt(req.body?.quantity);

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "product_id and quantity are required" });
    }

    const query = `
      INSERT INTO cart_items (cart_id, product_id, quantity, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET
        quantity = cart_items.quantity + EXCLUDED.quantity,
        updated_at = NOW()
      RETURNING id, cart_id, product_id, quantity, created_at, updated_at
    `;

    const result = await pool.query(query, [cartId, productId, quantity]);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("POST /api/cart failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const id = toPositiveInt(req.params.id);
    const quantity = toPositiveInt(req.body?.quantity);

    if (!id) return res.status(400).json({ message: "Invalid cart item id" });
    if (!quantity)
      return res.status(400).json({ message: "quantity is required" });

    const query = `
      UPDATE cart_items
      SET quantity = $1, updated_at = NOW()
      WHERE id = $2 AND cart_id = $3
      RETURNING id, cart_id, product_id, quantity, created_at, updated_at
    `;

    const result = await pool.query(query, [quantity, id, cartId]);
    const item = result.rows[0];

    if (!item) return res.status(404).json({ message: "Cart item not found" });
    return res.json(item);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("PUT /api/cart/:id failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const id = toPositiveInt(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid cart item id" });

    const query = `
      DELETE FROM cart_items
      WHERE id = $1 AND cart_id = $2
      RETURNING id
    `;

    const result = await pool.query(query, [id, cartId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(204).send();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/cart/:id failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cartId = getCartId(req);
    await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
    return res.status(204).send();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("DELETE /api/cart failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


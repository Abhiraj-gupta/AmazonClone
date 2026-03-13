const pool = require("../config/db");

function toPositiveInt(value, fallback) {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return n;
}

exports.getProducts = async (req, res) => {
  try {
    const page = toPositiveInt(req.query.page, 1);
    const limitRaw = toPositiveInt(req.query.limit, 12);
    const limit = Math.min(limitRaw, 100);
    const offset = (page - 1) * limit;

    const category = (req.query.category ?? "").toString().trim();
    const q = (req.query.q ?? "").toString().trim();

    const where = [];
    const params = [];

    if (category) {
      const isNumeric = /^[0-9]+$/.test(category);
      if (isNumeric) {
        params.push(Number.parseInt(category, 10));
        where.push(`p.category_id = $${params.length}`);
      } else {
        params.push(category);
        where.push(`c.name = $${params.length}`);
      }
    }

    if (q) {
      params.push(`%${q}%`);
      where.push(`p.name ILIKE $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${whereSql}
    `;

    const countResult = await pool.query(countQuery, params);
    const total = countResult.rows[0]?.total ?? 0;

    const dataParams = [...params, limit, offset];
    const limitParam = `$${dataParams.length - 1}`;
    const offsetParam = `$${dataParams.length}`;

    const dataQuery = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        c.name AS category_name,
        p.stock,
        p.rating,
        p.review_count,
        p.created_at,
        (
          SELECT pi.image_url FROM product_images pi
          WHERE pi.product_id = p.id AND pi.is_primary = true
          LIMIT 1
        ) AS image_url
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${whereSql}
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT ${limitParam} OFFSET ${offsetParam}
    `;

    const dataResult = await pool.query(dataQuery, dataParams);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items: dataResult.rows,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("GET /api/products failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        c.name AS category_name,
        p.stock,
        p.rating,
        p.review_count,
        p.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'image_url', pi.image_url,
              'alt_text', pi.alt_text,
              'is_primary', pi.is_primary,
              'sort_order', pi.sort_order,
              'created_at', pi.created_at
            )
            ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) AS images
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `;

    const result = await pool.query(query, [id]);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("GET /api/products/:id failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const q = (req.query.q ?? "").toString().trim();
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    const query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        c.name AS category_name,
        p.stock,
        p.rating,
        p.review_count,
        p.created_at
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.name ILIKE $1
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT 20
    `;

    const result = await pool.query(query, [`%${q}%`]);
    return res.json({ q, items: result.rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("GET /api/products/search failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


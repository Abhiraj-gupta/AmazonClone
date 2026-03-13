const pool = require("../config/db");

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Login required" });

    const result = await pool.query(
      `SELECT w.id, w.product_id, w.created_at,
              p.name, p.price, p.rating, p.review_count,
              (SELECT
                 CASE
                   WHEN pi.image_url LIKE 'http%' THEN pi.image_url
                   ELSE 'https://' || pi.image_url
                END
              FROM product_images pi
              WHERE pi.product_id = p.id AND pi.is_primary = true
              LIMIT 1) AS image_url
      FROM wishlist_items w
      JOIN products p ON p.id = w.product_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC`,
      [userId]
    );

    return res.json({ items: result.rows });
  } catch (err) {
    console.error("GET /api/wishlist failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Login required" });

    const productId = Number(req.body?.product_id);
    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ message: "Valid product_id is required" });
    }

    const result = await pool.query(
      `INSERT INTO wishlist_items (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING
       RETURNING id, product_id, created_at`,
      [userId, productId]
    );

    if (result.rowCount === 0) {
      return res.json({ message: "Already in wishlist" });
    }

    return res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error("POST /api/wishlist failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Login required" });

    const productId = Number(req.params.productId);
    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ message: "Valid product_id is required" });
    }

    await pool.query(
      `DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    return res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("DELETE /api/wishlist failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

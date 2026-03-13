const pool = require("../config/db");

exports.getCategories = async (req, res) => {
  try {
    const query = `
      SELECT id, name
      FROM categories
      ORDER BY name ASC
    `;
    const result = await pool.query(query);
    return res.json({ items: result.rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("GET /api/categories failed:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


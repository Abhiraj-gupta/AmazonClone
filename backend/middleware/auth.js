const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "amazonclone_jwt_secret_key";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authMiddleware, JWT_SECRET };

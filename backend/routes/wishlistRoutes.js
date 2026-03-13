const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/", authMiddleware, addToWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);

module.exports = router;

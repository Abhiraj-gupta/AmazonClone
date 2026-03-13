const express = require("express");
const {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", getCart);
router.post("/", addCartItem);
router.delete("/", clearCart);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

module.exports = router;


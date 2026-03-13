const express = require("express");
const { placeOrder, getOrders, cancelOrder, returnOrder } = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/", getOrders);
router.post("/", authMiddleware, placeOrder);
router.patch("/:id/cancel", authMiddleware, cancelOrder);
router.patch("/:id/return", authMiddleware, returnOrder);

module.exports = router;


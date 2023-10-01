const express = require("express");
const router = express.Router();
const orderService = require("../controllers/orderController");

router
  .route("/orders")
  .get(orderService.getOrders)
  .post(orderService.createOrder);

module.exports = router;

const Order = require("../models/order");
const logger = require('../Log/Logger.js');


const orderController = {
  // create a new order
  createOrder: async (req, res) => {
    const order = new Order({
      user: req.body.user,
      orderedItems: req.body.orderedItems,
    });

    try {
      const createdOrder = await order.save();
      logger.info(`Created a new order with ID: ${createdOrder._id}`);
      res.json(createdOrder);
    } catch (error) {
      logger.error(`Error creating order: ${error.message}`);
      res.status(500).json({ error: "Error creating order" });;
    }
  },

  // get all orders
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find();
      logger.info(`Fetched ${orders.length} orders`);
      res.json(orders);
    } catch (error) {
      logger.error(`Error fetching orders: ${error.message}`);
      res.status(500).json({ error: "Error fetching orders" });
    }
  },
};

module.exports = orderController;

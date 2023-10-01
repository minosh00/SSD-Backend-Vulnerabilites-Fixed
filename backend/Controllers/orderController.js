const Order = require("../models/order");

const orderController = {
  // create a new order
  createOrder: async (req, res) => {
    const order = new Order({
      user: req.body.user,
      orderedItems: req.body.orderedItems,
    });

    try {
      const createdOrder = await order.save();
      res.json(createdOrder);
    } catch (error) {
      res.status(500).json({ error: "Error creating order" });
    }
  },

  // get all orders
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Error fetching orders" });
    }
  },
};

module.exports = orderController;

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: { name: String, street: String, city: String, postalCode: String },
    required: true,
  },
  orderedItems: {
    type: [{ amount: Number, id: String, name: String, price: Number }],
    required: true,
  },
});

module.exports = mongoose.model('AllOrders', orderSchema);
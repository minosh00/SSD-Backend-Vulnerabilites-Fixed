const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative

  },
  images: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Food", foodSchema);

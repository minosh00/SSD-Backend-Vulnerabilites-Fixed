const Food = require("../models/Food");

const foodController = {
  // Create Food
  createFood: async (req, res) => {
    const foodData = req.body;
    const newFood = new Food({ ...foodData, creator: req.userId });
    try {
      await newFood.save();
      res.status(201).json(newFood);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },

  // Get all the foods
  getFoods: async (req, res) => {
    try {
      const meals = await Food.find();
      res.json(meals);
    } catch (error) {
      res.status(500).json({ message: "Error: " + error });
    }
  },

  // Get food by ID
  getFoodByID: async (req, res) => {
    const { id } = req.params;
    try {
      const food = await Food.findById(id);
      res.status(200).json(food);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Update food
  updateFood: async (req, res) => {
    try {
      const { name, description, price, images } = req.body;
      await Food.findOneAndUpdate(
        { _id: req.params.id },
        { name, description, price, images }
      );
      res.json({ msg: "Updated Food" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Delete food
  deleteFood: async (req, res) => {
    await Food.findByIdAndRemove(req.params.id, (error, food) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({
          success: true,
          food: food,
        });
      }
    });
  },
};

module.exports = foodController;

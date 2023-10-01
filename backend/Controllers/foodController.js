const Food = require("../models/Food");
const logger = require('../Log/Logger.js');

const foodController = {
  // Create Food
  createFood: async (req, res) => {
    const foodData = req.body;
    const newFood = new Food({ ...foodData, creator: req.userId });
    try {
      await newFood.save();
      logger.info('Created a new food item: ' + newFood._id); // Log the creation
      res.status(201).json(newFood);
    } catch (error) {
      logger.error('Error while creating a food item: ' + error.message);
      res.status(409).json({ message: error.message });
    }
  },

  // Get all the foods
  getFoods: async (req, res) => {
    try {
      const meals = await Food.find();
      logger.info('Retrieved all food items'); // Log the retrieval
      res.json(meals);

    } catch (error) {

      logger.error('Error while retrieving food items: ' + error.message);
      res.status(500).json({ message: "Error: " + error });
    }
  },

  // Get food by ID
  getFoodByID: async (req, res) => {
    const { id } = req.params;
    try {
      const food = await Food.findById(id);
      if (food) {
        logger.info(`Retrieved food item by ID: ${id}`);
        res.status(200).json(food);
      } else {
        logger.warn(`Food item with ID ${id} not found`);
        res.status(404).json({ message: "Food item not found" });
      }
    } catch (error) {
      logger.error(`Error while retrieving food item by ID ${id}: ${error.message}`);
      res.status(500).json({ message: error.message });
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
      logger.info(`Updated food item with ID: ${req.params.id}`);
      res.json({ msg: "Updated Food" });
    } catch (err) {
      logger.error(`Error while updating food item with ID ${req.params.id}: ${err.message}`);
      return res.status(500).json({ msg: err.message });
    }
  },

  // Delete food
  deleteFood: async (req, res) => {
    try {
      const food = await Food.findByIdAndRemove(req.params.id);
      if (food) {
        logger.info(`Deleted food item with ID: ${req.params.id}`);
        res.status(200).json({
          success: true,
          food: food,
        });
      } else {
        logger.warn(`Food item with ID ${req.params.id} not found`);
        res.status(404).json({ message: "Food item not found" });
      }
    } catch (error) {
      logger.error(`Error while deleting food item with ID ${req.params.id}: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = foodController;

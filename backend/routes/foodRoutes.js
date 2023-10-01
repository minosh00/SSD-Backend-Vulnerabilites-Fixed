const router = require("express").Router();
const FoodService = require("../controllers/foodController");

router
  .route("/foods")
  .get(FoodService.getFoods)
  .post(FoodService.createFood);

router
  .route("/foods/:id")
  .get(FoodService.getFoodByID)
  .patch(FoodService.updateFood)
  .delete(FoodService.deleteFood);
  
module.exports = router;

const express = require("express");
const router = express.Router();

const {getMenuById,createMenu,updateMenuByID,get,RemoveFood} = require("../Controllers/Food.controllers");


router.post("/menu",createMenu);
router.get("/getAllMenu",get);
router.get("/getMenuById/:id",getMenuById);
router.patch("/updateMenuByID/:id",updateMenuByID);
router.delete("/RemoveFood/:id",RemoveFood);


module.exports = router;
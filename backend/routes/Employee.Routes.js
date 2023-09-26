


const express = require("express");
const router = express.Router();

const {getAllEmployee,updateEmployeeByID,createEmployee,RemoveEmployee,getEmployeeById} = require("../Controllers/Employee.Controller");


router.post("/createEmployee",createEmployee);
router.get("/getAllEmployee",getAllEmployee);
router.get("/getEmployeeById/:id",getEmployeeById);
router.patch("/updateEmployeeByID/:id",updateEmployeeByID);
router.delete("/RemoveEmployee/:id",RemoveEmployee);


module.exports = router;
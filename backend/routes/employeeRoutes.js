const router = require("express").Router();
const EmployeeService = require("../controllers/employeeController");

router
  .route("/employees")
  .post(EmployeeService.createEmployee)
  .get(EmployeeService.getEmployees);

router
  .route("/employees/:id")
  .get(EmployeeService.getEmployeeById)
  .patch(EmployeeService.updateEmployee)
  .delete(EmployeeService.removeEmployee);

module.exports = router;

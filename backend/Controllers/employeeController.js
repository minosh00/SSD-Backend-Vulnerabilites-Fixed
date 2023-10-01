const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const employeesController = {
  createEmployee: async (req, res) => {
    const employeeData = req.body;

    if (employeeData.fname.length < 5)
      return res.status(400).json({
        errorMessage: "Please enter a fname of at least 5 characters.",
      });

    const newEmployee = new Employee({ ...employeeData, creator: req.userId });

    try {
      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },

  getEmployees: async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateEmployee: async (req, res) => {
    const { id } = req.params;
    const { fname, lname, JobPosition, gender, HomeAddress, email, Pnumber } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No employee with id: ${id}`);

    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        {
          fname,
          lname,
          JobPosition,
          gender,
          HomeAddress,
          email,
          Pnumber,
        },
        { new: true }
      );

      if (!updatedEmployee)
        return res.status(404).json({ message: "Employee not found" });

      res.json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  removeEmployee: async (req, res) => {
    const { id } = req.params;

    try {
      const removedEmployee = await Employee.findByIdAndRemove(id);

      if (!removedEmployee)
        return res.status(404).json({ message: "Employee not found" });

      res.status(200).json({
        success: true,
        employee: removedEmployee,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getEmployeeById: async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await Employee.findById(id);

      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = employeesController;

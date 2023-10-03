const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const logger = require('../Log/Logger.js');

const employeesController = {
  // Create a new employee
  createEmployee: async (req, res) => {
    const employeeData = req.body;
    
    try {
      if (employeeData.fname.length < 5) {
        logger.warn('Employee creation failed due to invalid fname length');
        return res.status(400).json({
          errorMessage: "Please enter a fname of at least 5 characters.",
        });
      }

      const newEmployee = new Employee({ ...employeeData, creator: req.userId });

      const savedEmployee = await newEmployee.save();

      logger.info(`Employee created with id ${savedEmployee._id}`);
      res.status(201).json(savedEmployee);
    } catch (error) {
      logger.error('Error while creating employee: ' + error.message);
      res.status(409).json({ message: error.message });
    }
  },

  // Get all employees
  getEmployees: async (req, res) => {
    try {
      const employees = await Employee.find();
      logger.info('Retrieved all employees successfully');
      res.status(200).json(employees);
    } catch (error) {
      logger.error('Error while getting employees: ' + error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // Get an employee by ID
  getEmployeeById: async (req, res) => {
    const { id } = req.params;

    try {
      const employee = await Employee.findById(id);

      if (!employee) {
        logger.warn(`Employee with id ${id} not found`);
        return res.status(404).json({ message: "Employee not found" });
      }
      
      logger.info(`Retrieved employee with id ${id}`);
      res.status(200).json(employee);

    } catch (error) {
      logger.error('Error while getting employee by ID: ' + error.message);
      res.status(500).json({ message: error.message });
    }
  },
  
  // Update an employee by ID
  updateEmployee: async (req, res) => {
    const { id } = req.params;
    const { fname, lname, JobPosition, gender, HomeAddress, email, Pnumber } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No employee with this ID`);
    }

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

      if (!updatedEmployee) {
        logger.warn(`Employee with id ${id} not found for update`);
        return res.status(404).json({ message: "Employee not found" });
      }
      
      logger.info(`Updated employee with id ${id}`);
      res.json(updatedEmployee);
    } catch (error) {
      logger.error('Error while updating employee: ' + error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // Remove an employee by ID
  removeEmployee: async (req, res) => {
    const { id } = req.params;

    try {
      const removedEmployee = await Employee.findByIdAndRemove(id);

      if (!removedEmployee) {
        logger.warn(`Employee with id ${id} not found for removal`);
        return res.status(404).json({ message: "Employee not found" });
      }
      
      logger.info(`Removed employee with id ${id}`);
      res.status(200).json({
        success: true,
        employee: removedEmployee,
      });
    } catch (error) {
      logger.error('Error while removing employee: ' + error.message);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = employeesController;

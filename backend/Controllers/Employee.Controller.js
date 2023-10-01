const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const logger = require('../Log/Logger.js');

const getAllEmployee = async (req, res) => {
    try {
        const employees = await Employee.find();
        logger.info('GET request for all employees');
        res.status(200).json(employees);
    } catch (error) {
        logger.error('Error while fetching employees: ' + error.message);
        res.status(404).json({ message: error.message });
    }
};

const updateEmployeeByID = async (req, res) => {
    const { id } = req.params;
    const {
        fname,
        lname,
        JobPosition,
        gender,
        HomeAddress,
        email,
        Pnumber,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Invalid employee ID: ${id}`);
        return res.status(404).send(`No employee with id: ${id}`);
    }

    const updatedEmployee = {
        fname,
        lname,
        JobPosition,
        gender,
        HomeAddress,
        email,
        Pnumber,
        _id: id,
    };

    try {
        const result = await Employee.findByIdAndUpdate(id, updatedEmployee, {
            new: true,
        });
        if (!result) {
            logger.error(`Employee with ID ${id} not found`);
            return res.status(404).json({ message: 'Employee not found' });
        }
        logger.info(`Updated employee with ID ${id}`);
        res.json(updatedEmployee);
    } catch (error) {
        logger.error('Error while updating employee: ' + error.message);
        res.status(500).json({ message: error.message });
    }
};

const RemoveEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndRemove(req.params.id);
        if (!employee) {
            logger.error(`Employee with ID ${req.params.id} not found`);
            return res.status(404).json({ message: 'Employee not found' });
        }
        logger.info(`Removed employee with ID ${req.params.id}`);
        res.status(200).json({
            success: true,
            employee: employee,
        });
    } catch (error) {
        logger.error('Error while removing employee: ' + error.message);
        res.status(500).json({ error: error.message });
    }
};

const createEmployee = async (req, res) => {
    const groups = req.body;

    if (groups.fname.length < 5) {
        logger.error('Employee fname is too short');
        return res.status(400).json({
            errorMessage: 'Please enter a fname of at least 5 characters.',
        });
    }

    const newEmployee = new Employee({ ...groups, creator: req.userId });

    try {
        await newEmployee.save();
        logger.info('Created a new employee');
        res.status(201).json(newEmployee);
    } catch (error) {
        logger.error('Error while creating a new employee: ' + error.message);
        res.status(409).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            logger.error(`Employee with ID ${id} not found`);
            return res.status(404).json({ message: 'Employee not found' });
        }
        logger.info(`GET request for employee with ID ${id}`);
        res.status(200).json(employee);
    } catch (error) {
        logger.error('Error while fetching employee by ID: ' + error.message);
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getAllEmployee,
    updateEmployeeByID,
    createEmployee,
    RemoveEmployee,
    getEmployeeById,
};

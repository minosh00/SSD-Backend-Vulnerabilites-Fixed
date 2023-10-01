const express = require('express');
const router = express.Router();
const Groups = require('../models/Food');
const logger = require('../Log/Logger.js');

const get = async (req, res) => { 
    try {
        const meals = await Groups.find();
        logger.info('GET request for all meals');
        res.json(meals);
      } catch (error) {
        logger.error('Error while fetching meals: ' + error);
        res.status(500).send('Error: ' + error);
      }
}

const updateMenuByID = async (req, res) => {
    try {
        const { name, description, price, images } = req.body;
        await Groups.findOneAndUpdate({ _id: req.params.id }, { name, description, price, images })
        logger.info(`Updated menu with ID ${req.params.id}`);
        res.json({ msg: "Updated Menu" })
    } catch (err) {
        logger.error('Error while updating menu: ' + err.message);
        return res.status(500).json({ msg: err.message })
    }
}


const RemoveFood = async (request, response) => {
    try {
        const food = await Groups.findByIdAndRemove(request.params.id);
        if (!food) {
            logger.error(`Food with ID ${request.params.id} not found`);
            return response.status(404).json({ error: 'Food not found' });
        }
        logger.info(`Removed food with ID ${request.params.id}`);
        response.status(200).json({
            success: true,
            food: food
        });
    } catch (error) {
        logger.error('Error while removing food: ' + error.message);
        response.status(500).json({ error: error.message });
    }
}

const createMenu = async (req, res) => {
    const groups = req.body;
    const newGroups = new Groups({ ...groups, creator: req.userId })
    try {
        await newGroups.save();
        logger.info('Created a new menu');
        res.status(201).json(newGroups);
    } catch (error) {
        logger.error('Error while creating a new menu: ' + error.message);
        res.status(409).json({ message: error.message });
    }
}

const getMenuById = async (req, res) => { 
    const { id } = req.params;
    try {
        const groups = await Groups.findById(id);
        if (!groups) {
            logger.error(`Menu with ID ${id} not found`);
            return res.status(404).json({ message: 'Menu not found' });
        }
        logger.info(`GET request for menu with ID ${id}`);
        res.status(200).json(groups);
    } catch (error) {
        logger.error('Error while fetching menu by ID: ' + error.message);
        res.status(404).json({ message: error.message });
    }
}


module.exports ={getMenuById,createMenu,updateMenuByID,get,RemoveFood};
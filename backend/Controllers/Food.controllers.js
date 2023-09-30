const express = require('express');
const router = express.Router();
const Groups = require('../models/Food');
const xml2js = require('xml2js'); // Import xml2js library
const { check, validationResult } = require('express-validator');


const get = async (req, res) => { 
    try {
        const meals = await Groups.find();
        res.json(meals);
      } catch (error) {
        res.send('Error: ' + error);
      }
    }

const updateMenuByID = async (req, res) => {
    try {
        const { name, description, price, images } = req.body;
        await Groups.findOneAndUpdate({ _id: req.params.id }, { name, description, price, images })
        res.json({ msg: "Updated Menu" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

const RemoveFood = async (request,response) => {
    await Groups.findByIdAndRemove(request.params.id,(error,food) => {
        if(error){
            response.status(500).json({ error: error.message });
        }
        else{
            response.status(200).
            json({
                success: true,
                food: food
            })
        }
    })
}


// Input validation middleware for the "createMenu" route
const validateMenuInput = [
  check('name').notEmpty().isString(),
  check('description').notEmpty().isString(),
  check('price').notEmpty().isNumeric(),
  check('images').notEmpty().isString(),
];
const createMenu = async (req, res) => {
  try {
    let inputData;
    if (req.is('json')) {
      // JSON data
      inputData = req.body;
    } else if (req.is('xml')) {
      // XML data
      const xmlInput = req.body;

      // Configure xml2js to disable external entity expansion
      const parser = new xml2js.Parser({
        explicitCharkey: true,
        explicitRoot: false,
        explicitArray: false,
        ignoreAttrs: true,
        mergeAttrs: false,
        charsAsChildren: true,
        async: true,
      });

      // Parse the XML input
      const result = await parser.parseStringPromise(xmlInput);

      // Process the parsed XML data (you can use 'result' here)
      inputData = {
        name: result.name,
        description: result.description,
        price: result.price,
        images: result.images.image,
      };
    } else {
      return res.status(400).json({ message: 'Unsupported Content-Type' });
    }

    // Create and save the new menu item to the database
    const createdMenuItem = new Groups(inputData);
    await createdMenuItem.save();

    res.status(201).json({ message: 'Menu item created successfully' });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};




const getMenuById = async (req, res) => { 
    const { id } = req.params;
    try {
        const groups = await Groups.findById(id);
        res.status(200).json(groups);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


module.exports ={getMenuById,createMenu,updateMenuByID,get,RemoveFood};
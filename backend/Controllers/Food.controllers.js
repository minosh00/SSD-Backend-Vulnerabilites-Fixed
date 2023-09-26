const express = require('express');
const router = express.Router();
const Groups = require('../models/Food');

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

const createMenu= async (req, res) => {
    const groups = req.body;
    const newGroups = new Groups({ ...groups, creator: req.userId })
    try {
        await newGroups.save();
        res.status(201).json(newGroups );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

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
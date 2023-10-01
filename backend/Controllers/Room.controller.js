const mongoose = require('mongoose');
const ROOMS = require("../models/Rooms");
const logger = require('../Log/Logger.js');


//get all rooms
const getAllRooms = async (req, res) => {
    try {
        const groups = await ROOMS.find();
        logger.info('GET request for all rooms');
        res.status(200).json(groups);
    } catch (error) {
        logger.error('Error while fetching rooms: ' + error.message);
        res.status(404).json({ message: error.message });
    }
}

//update rooms by ID
const updateRoomsByID = async (req, res) => {
    const { id } = req.params;
    const { name, maxcount, adult, children, bedroom, rentperday, imageurls, description, features, type } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Invalid room ID: ${id}`);
        return res.status(404).send(`No room with id: ${id}`);
    }
    const updatedRoom = { name, maxcount, adult, children, bedroom, rentperday, imageurls, features, description, type, _id: id };
    try {
        const result = await ROOMS.findByIdAndUpdate(id, updatedRoom, { new: true });
        if (!result) {
            logger.error(`Room with ID ${id} not found`);
            return res.status(404).json({ message: 'Room not found' });
        }
        logger.info(`Updated room with ID ${id}`);
        res.json(updatedRoom);
    } catch (error) {
        logger.error('Error while updating room: ' + error.message);
        res.status(500).json({ message: error.message });
    }
}

//update rooms by ID
const updateRoomsByID1 = async (req, res) => {
    const { id } = req.params;
    const { name, maxcount, adult, children, bedroom, rentperday, imageurls, description, features, type } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.error(`Invalid room ID: ${id}`);
        return res.status(404).send(`No room with id: ${id}`);
    }
    const updatedRoom = { name, maxcount, adult, children, bedroom, rentperday, imageurls, features, description, type, _id: id };
    try {
        const result = await ROOMS.findByIdAndUpdate(id, updatedRoom, { new: true });
        if (!result) {
            logger.error(`Room with ID ${id} not found`);
            return res.status(404).json({ message: 'Room not found' });
        }
        logger.info(`Updated room with ID ${id}`);
        res.json(updatedRoom);
    } catch (error) {
        logger.error('Error while updating room: ' + error.message);
        res.status(500).json({ message: error.message });
    }
}
//remobe room by ID
const RemoveRooms = async (request, response) => {
    try {
        const room = await ROOMS.findByIdAndRemove(request.params.id, (error, room) => {
            if (error) {
                logger.error('Error while removing room: ' + error.message);
                response.status(500).json({ error: error.message });
            } else {
                logger.info(`Removed room with ID ${request.params.id}`);
                response.status(200).json({
                    success: true,
                    room: room
                });
            }
        });
    } catch (error) {
        logger.error('Error while removing room: ' + error.message);
        response.status(500).json({ error: error.message });
    }
}


//add new room by ID
const createRooms = async (req, res) => {
    const groups = req.body;
    if (groups.name.length < 1) {
        const errorMessage = "Please enter a Room name of at least 1 character.";
        logger.error(`Invalid room name: ${groups.name}`);
        return res.status(400).json({ errorMessage });
    }

    const newRoom = new ROOMS({ ...groups, creator: req.userId });

    try {
        await newRoom.save();
        logger.info('Created a new room');
        res.status(201).json(newRoom);
    } catch (error) {
        logger.error('Error while creating a new room: ' + error.message);
        res.status(409).json({ message: error.message });
    }
}

//get room by ID
const getRoomsById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await ROOMS.findById(id);
        if (!room) {
            logger.error(`Room with ID ${id} not found`);
            return res.status(404).json({ message: 'Room not found' });
        }
        logger.info(`GET request for room with ID ${id}`);
        res.status(200).json(room);
    } catch (error) {
        logger.error('Error while fetching room by ID: ' + error.message);
        res.status(404).json({ message: error.message });
    }
}

//adult
const getDetailsAdult = async (req, res) => {
    try {
        let adult = req.params.adult;
        const rooms = await ROOMS.find({ adult: adult });
        logger.info(`GET request for rooms with adult count: ${adult}`);
        res.status(200).json(rooms);
    } catch (error) {
        logger.error('Error while fetching rooms by adult count: ' + error.message);
        res.status(500).json({ message: error.message });
    }
}
//children
const getDetailsChildren = async (req, res) => {
    try {
        let children = req.params.children;
        const rooms = await ROOMS.find({ children: children });
        logger.info(`GET request for rooms with children count: ${children}`);
        res.status(200).json(rooms);
    } catch (error) {
        logger.error('Error while fetching rooms by children count: ' + error.message);
        res.status(500).json({ message: error.message });
    }
}


//bedroom
const getDetailsBedroom = async (req, res) => {
    try {
        let bedroom = req.params.bedroom;
        const rooms = await ROOMS.find({ bedroom: bedroom });
        logger.info(`GET request for rooms with bedroom count: ${bedroom}`);
        res.status(200).json(rooms);
    } catch (error) {
        logger.error('Error while fetching rooms by bedroom count: ' + error.message);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllRooms, updateRoomsByID, RemoveRooms, createRooms, getRoomsById, updateRoomsByID1, getDetailsAdult, getDetailsChildren, getDetailsBedroom };


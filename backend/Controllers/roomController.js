const mongoose = require("mongoose");
const Room = require("../models/Room");
const logger = require("../Log/Logger.js");

function validateRoomName(name) {
  if (typeof name !== "string" || name.trim().length < 1) {
    throw new Error("Please enter a room name of at least 1 character.");
  }
}

const roomController = {
  // Create room
  createRoom: async (req, res) => {
    const roomData = req.body;

    try {
      // Validate room name
      validateRoomName(roomData.name);

      // Create a new room
      const newRoom = new Room({ ...roomData, creator: req.userId });

      // Save the room to the database
      await newRoom.save();
      logger.info(`Created a new room with ID: ${newRoom._id}`);
      res.status(201).json(newRoom);
    } catch (error) {
      logger.error(`Error creating room: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  },

  // Get all the rooms
  getRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      logger.info(`Fetched ${rooms.length} rooms`);
      res.status(200).json(rooms);
    } catch (error) {
      logger.error(`Error fetching rooms: ${error.message}`);
      res.status(404).json({ message: error.message });
    }
  },

  // Get a room by ID
  getRoomById: async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);

      if (!room) return res.status(404).json({ message: "Room not found" });
      logger.info(`Fetched room with ID: ${id}`);

      res.status(200).json(room);
    } catch (error) {
      logger.error(`Error fetching room: ${error.message}`);
      res.status(404).json({ message: error.message });
    }
  },

  // Update room
  updateRoom: async (req, res) => {
    const { id } = req.params;
    const {
      name,
      maxcount,
      adult,
      children,
      bedroom,
      rentperday,
      imageurls,
      description,
      features,
      type,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`Invalid room ID: ${id}`);
      return res.status(404).send(`No room with this id`);
    }

    const updatedRoom = {
      name,
      maxcount,
      adult,
      children,
      bedroom,
      rentperday,
      imageurls,
      features,
      description,
      type,
      _id: id,
    };

    try {
      const updatedRoomDoc = await Room.findByIdAndUpdate(id, updatedRoom, {
        new: true,
      });

      if (!updatedRoomDoc) {
        logger.error(`Room with ID ${id} not found`);
        return res.status(404).json({ message: "Room not found" });
      }
      logger.info(`Updated room with ID: ${id}`);
      res.json(updatedRoomDoc);
    } catch (error) {
      logger.error(`Error updating room: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },

  // Delete room
  deleteRoom: async (req, res) => {
    try {
      const removedRoom = await Room.findByIdAndRemove(req.params.id);

      if (!removedRoom) {
        logger.error(`Room with ID ${req.params.id} not found`);
        return res.status(404).json({ message: "Room not found" });
      }

      logger.info(`Deleted room with ID: ${req.params.id}`);
      res.status(200).json({
        success: true,
        room: removedRoom,
      });
    } catch (error) {
      logger.error(`Error deleting room: ${error.message}`);
      res.status(500).json({ message: error.message });
    }
  },

  // Get rooms by adult count
  getRoomsByAdult: async (req, res) => {
    try {
      let adult = req.params.adult;
      const rooms = await Room.find({ adult: adult });
      logger.info(`Fetched rooms with adult count: ${adult}`);
      res.status(200).json(rooms);
    } catch (err) {
      logger.error(`Error fetching rooms by adult count: ${err.message}`);
      res.json(err);
    }
  },

  // Get rooms by children count
  getRoomsByChildren: async (req, res) => {
    try {
      let children = req.params.children;
      const rooms = await Room.find({ children: children });
      logger.info(`Fetched rooms with children count: ${children}`);
      res.status(200).json(rooms);
    } catch (err) {
      logger.error(`Error fetching rooms by children count: ${err.message}`);
      res.json(err);
    }
  },

  // Get rooms by bedroom count
  getRoomsByBedroom: async (req, res) => {
    try {
      let bedroom = req.params.bedroom;
      const rooms = await Room.find({ bedroom: bedroom });
      logger.info(`Fetched rooms with bedroom count: ${bedroom}`);
      res.status(200).json(rooms);
    } catch (err) {
      logger.error(`Error fetching rooms by bedroom count: ${err.message}`);
      res.json(err);
    }
  },
};

module.exports = roomController;

const mongoose = require("mongoose");
const Room = require("../models/Room");

const roomController = {
  // Create room
  createRoom: async (req, res) => {
    const roomData = req.body;

    if (roomData.name.length < 1)
      return res.status(400).json({
        errorMessage: "Please enter a room name of at least 1 character.",
      });

    const newRoom = new Room({ ...roomData, creator: req.userId });

    try {
      await newRoom.save();
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  },
  
  // Get all the rooms
  getRooms: async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  // Get a room by ID
  getRoomById: async (req, res) => {
    const { id } = req.params;

    try {
      const room = await Room.findById(id);

      if (!room) return res.status(404).json({ message: "Room not found" });

      res.status(200).json(room);
    } catch (error) {
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

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No room with id: ${id}`);

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

      if (!updatedRoomDoc)
        return res.status(404).json({ message: "Room not found" });

      res.json(updatedRoomDoc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete room
  deleteRoom: async (req, res) => {
    try {
      const removedRoom = await Room.findByIdAndRemove(req.params.id);

      if (!removedRoom)
        return res.status(404).json({ message: "Room not found" });

      res.status(200).json({
        success: true,
        room: removedRoom,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get rooms by adult count
  getRoomsByAdult: async (req, res) => {
    try {
      let adult = req.params.adult;
      const rooms = await Room.find({ adult: adult });
      res.status(200).json(rooms);
    } catch (err) {
      res.json(err);
    }
  },

  // Get rooms by children count
  getRoomsByChildren: async (req, res) => {
    try {
      let children = req.params.children;
      const rooms = await Room.find({ children: children });
      res.status(200).json(rooms);
    } catch (err) {
      res.json(err);
    }
  },

  // Get rooms by bedroom count
  getRoomsByBedroom: async (req, res) => {
    try {
      let bedroom = req.params.bedroom;
      const rooms = await Room.find({ bedroom: bedroom });
      res.status(200).json(rooms);
    } catch (err) {
      res.json(err);
    }
  },
};

module.exports = roomController;

const express = require("express");
const RoomCtrl = require('../Controllers/Room.controller');
const router = express.Router();

const { getAllRooms, updateRoomsByID, RemoveRooms, createRooms, getRoomsById, updateRoomsByID1, getDetailsAdult, getDetailsChildren, getDetailsBedroom } = require("../Controllers/Room.controller");

router.post("/room", createRooms);
router.get("/getAllRooms", getAllRooms);
router.get("/getRoomsById/:id", getRoomsById);
router.patch("/updateRoomsByID/:id", updateRoomsByID);
router.delete("/RemoveRooms/:id", RemoveRooms);
router.patch("/updateRoomsByID1/:id", updateRoomsByID1);

router.get("/getadult/:adult", getDetailsAdult)
router.get("/getchildren/:children", getDetailsChildren)
router.get("/getbedroom/:bedroom", getDetailsBedroom)

module.exports = router;
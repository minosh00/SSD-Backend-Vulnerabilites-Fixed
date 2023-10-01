const router = require("express").Router();
const RoomService = require("../controllers/roomController");

router
  .route("/rooms")
  .get(RoomService.getRooms)
  .post(RoomService.createRoom);

router
  .route("/rooms/:id")
  .get(RoomService.getRoomById)
  .put(RoomService.updateRoom)
  .delete(RoomService.deleteRoom);

router.route("/rooms/:id/adult/:adultCount").get(RoomService.getRoomsByAdult);
router.route("/rooms/:id/children/:childrenCount").get(RoomService.getRoomsByChildren);
router.route("/rooms/:id/children/:bedCount").get(RoomService.getRoomsByBedroom);

module.exports = router;

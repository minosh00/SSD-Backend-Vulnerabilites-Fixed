const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  noOfStars: { type: Number, required: true, default: 0 },
  comment: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPNumber: { type: String, required: true },
  userImage: { type: String, default: "" },
  likes: {type: Number, default: 0},
  roomID: {type: String, default: ""}
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

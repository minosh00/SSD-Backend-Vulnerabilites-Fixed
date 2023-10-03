const Comment = require("../models/Comment");
const logger = require("../Log/Logger.js");

const commentsController = {
  // Create Comment
  createComment: async (req, res) => {
    try {
      const { noOfStars, comment, userEmail, userPNumber, userImage, roomID } =
        req.body;

      logger.info("Received request to create a new comment", req.body);

      const newComment = new Comment({
        noOfStars,
        comment,
        userEmail,
        userPNumber,
        userImage,
        roomID,
      });

      await newComment.save();

      logger.info("Comment added successfully");
      res.json({ msg: "Comment added!" });
    } catch (err) {
      logger.error("Error while creating comment: " + err.message);
      return res.status(500).json({ msg: err.message });
    }
  },

  // Get all the comments
  getComments: async (req, res) => {
    try {
      const roomID = req.query.roomID;

      // Sanitize and escape user input
      const sanitizedInput = req.query.comment.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );

      // Create a regular expression with the sanitized input
      const regex = new RegExp(`.*${sanitizedInput}.*`);

      const comments = await Comment.find({
        roomID: roomID,
        comment: regex,
      });

      logger.info(
        `Fetched comments for roomID ${roomID} with comment containing "${req.query.comment}"`
      );
      res.json(comments);
    } catch (err) {
      logger.error("Error while fetching comments: " + err.message);
      return res.status(500).json({ msg: err.message });
    }
  },

  // Get comment by ID
  getCommentByID: async (req, res) => {
    try {
      let id = req.params.id;
      const comment = await Comment.findById(id);

      if (!comment) {
        logger.warn(`Comment with id ${id} not found`);
        return res
          .status(404)
          .json({ message: `Comment with id ${id} not found` });
      }

      logger.info(`Fetched comment with id ${id} successfully`);
      res.json(comment);
    } catch (err) {
      logger.error(
        `Error while fetching comment with id ${id}: ` + err.message
      );
      return res.status(500).json({ msg: err.message });
    }
  },

  // Update comment
  updateComment: async (req, res) => {
    try {
      const {
        noOfStars,
        comment,
        userEmail,
        userPNumber,
        userImage,
        likes,
        roomID,
      } = req.body;
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { noOfStars, comment, userEmail, userPNumber, userImage, likes, roomID }
      );
      logger.info(`Comment with id ${commentId} updated successfully`);
      res.json({ msg: "Comment updated!" });
    } catch (err) {
      logger.error("Error while updating comment: " + err.message);
      return res.status(500).json({ msg: err.message });
    }
  },

  // supplier comment
  deleteComment: async (req, res) => {
    try {
      let id = req.params.id;
      await Comment.findByIdAndDelete(id);
      res.json({ msg: "Comment deleted!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //Add like
  addLike: async (req, res) => {
    try {
      const comment = await Comment.findOne({ _id: req.params.id });
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { likes: Number(comment.likes) + 1 }
      );

      logger.info(`Like added to comment with id ${commentId}`);
      res.json({ msg: "Like Added!" });
    } catch (err) {
      logger.error("Error while adding like to comment: " + err.message);
      return res.status(500).json({ msg: err.message });
    }
  },

  //Remove like
  removeLike: async (req, res) => {
    try {
      const comment = await Comment.findOne({ _id: req.params.id });
      await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { likes: Number(comment.likes) - 1 }
      );

      logger.info(`Like removed from comment with id ${commentId}`);
      res.json({ msg: "Like Removed!" });
    } catch (err) {
      logger.error("Error while removing like from comment: " + err.message);
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = commentsController;

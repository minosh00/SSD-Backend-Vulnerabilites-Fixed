const Comment = require("../models/Comment");

const commentsController = {
  // Create Comment
  createComment: async (req, res) => {
    try {
      const { noOfStars, comment, userEmail, userPNumber, userImage, roomID } =
        req.body;

        console.log(req.body)

      const newComment = new Comment({
        noOfStars,
        comment,
        userEmail,
        userPNumber,
        userImage,
        roomID
      });

      await newComment.save();
      res.json({ msg: "Comment added!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Get all the comments
  getComments: async (req, res) => {
    try {
      const roomID = req.query.roomID;
      const comments = await Comment.find({roomID: roomID, comment: new RegExp(`.*${req.query.comment}.*`)});
      res.json(comments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Get comment by ID
  getCommentByID: async (req, res) => {
    try {
      let id = req.params.id;
      const comment = await Comment.findById(id);
      res.json(comment);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //Update comment
  updateComment: async (req, res) => {
    try {
      const { noOfStars, comment, userEmail, userPNumber, userImage, likes, roomID } = req.body;
      await Comment.findOneAndUpdate({ _id: req.params.id }, { noOfStars, comment, userEmail, userPNumber, userImage, likes, roomID })

      res.json({ msg: "Comment updated!" })

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //Add like
  addLike: async (req, res) => {
    try {
      const comment = await Comment.findOne({_id: req.params.id});
      await Comment.findOneAndUpdate({_id: req.params.id}, {likes: Number(comment.likes) + 1});

      res.json({ msg: "Like Added!" });

    } catch(err) {
      return res.status(500).json({msg: err.message});
    }
  },

  //Remove like
  removeLike: async (req, res) => {
    try {
      const comment = await Comment.findOne({_id: req.params.id});
      await Comment.findOneAndUpdate({_id: req.params.id}, {likes: Number(comment.likes) - 1});

      res.json({ msg: "Like Removed!" });
      
    } catch(err) {
      return res.status(500).json({msg: err.message});
    }
  },

  // Delete comment
  deleteComment: async (req, res) => {
    try{
        let id = req.params.id;
        await Comment.findByIdAndDelete(id)
        res.json({msg: "Comment deleted!"})
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = commentsController;

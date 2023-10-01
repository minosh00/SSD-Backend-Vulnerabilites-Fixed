const router = require("express").Router();
const CommentService = require("../controllers/commentController");

router
  .route("/comments")
  .get(CommentService.getComments)
  .post(CommentService.createComment);

router
  .route("/comments/:id")
  .get(CommentService.getCommentByID)
  .put(CommentService.updateComment)
  .delete(CommentService.deleteComment);

router.route("/comments/:id/addLike").post(CommentService.addLike);
router.route("/comments/:id/removeLike").post(CommentService.removeLike);

module.exports = router;

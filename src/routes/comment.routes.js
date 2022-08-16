const express = require('express');

const authController = require('../controllers/auth.controllers');
const commentController = require('../controllers/comment.controllers');

const router = express.Router({ mergeParams: true });

router.route('/').get(commentController.getAllComments).post(
  authController.protect,
  authController.restrictTo('user', 'admin'),
  // commentController.setPostUserIds,
  commentController.createComment
);

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    commentController.updateComment
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    commentController.deleteComment
  );

module.exports = router;

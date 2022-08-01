const express = require('express');

const authController = require('../controllers/auth.controllers');
const postController = require('../controllers/post.controllers');
const upload = require('../utils/multer.utils');

const commentRouter = require('./comment.routes');

const router = express.Router();

router.use('/:postId/comments', commentRouter);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    upload.single('imageCover'),
    postController.setUserId,
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    postController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    postController.deletePost
  );

module.exports = router;

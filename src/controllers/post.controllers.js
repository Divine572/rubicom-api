const Post = require('../models/post.model');
const AppError = require('../utils/error.utils');
const catchAsync = require('../utils/catchAsync.utils');
const APIFeatures = require('../utils/apiFeature.utils');
const { upload } = require('../utils/cloudinary.utils');
const { filteredObj } = require('./user.controllers');

exports.uploadPostImage = upload.single('imageCover');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({
    title: req.body.title,
    body: req.body.body,
    keywords: req.body.keywords,
    imageCover: req.file.path,
    user: req.user.id,
  });
  // console.log(post);

  res.status(201).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Post.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const posts = await features.query;
  res.status(201).json({
    status: 'success',
    result: posts.length,
    data: {
      data: posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const filteredBody = filteredObj(req.body, 'title', 'body', 'imageCover');

  const post = await Post.findByIdAndUpdate(req.params.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  if (!post) {
    return next(new AppError('No post found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return next(new AppError('No post found with this id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

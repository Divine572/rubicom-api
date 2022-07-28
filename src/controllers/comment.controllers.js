const Comment = require('../models/comment.model');
const AppError = require('../utils/error.utils');
const catchAsync = require('../utils/catchAsync.utils');
const APIFeatures = require('../utils/apiFeature.utils');

exports.setPostUserIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: comment,
    },
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.postId) filter = { post: req.params.postId };

  const features = new APIFeatures(Comment.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const comments = await features.query;
  res.status(201).json({
    status: 'success',
    result: comments.length,
    data: {
      data: comments,
    },
  });
});

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: comment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!comment) {
    return next(new AppError('No comment found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with this id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

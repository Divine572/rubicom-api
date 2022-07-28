const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync.utils');
const AppError = require('../utils/error.utils');
const APIFeatures = require('../utils/apiFeature.utils');

const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const user = await features.query;
  res.status(201).json({
    status: 'success',
    result: user.length,
    data: {
      data: user,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!user) {
    return next(new AppError('No user found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with this id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filteredBody = filteredObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

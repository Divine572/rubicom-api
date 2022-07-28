const Job = require('../models/job.model');
const AppError = require('../utils/error.utils');
const catchAsync = require('../utils/catchAsync.utils');
const APIFeatures = require('../utils/apiFeature.utils');

exports.createJob = catchAsync(async (req, res, next) => {
  const job = await Job.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: job,
    },
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Job.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const jobs = await features.query;
  res.status(201).json({
    status: 'success',
    result: jobs.length,
    data: {
      data: jobs,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError('No job found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: job,
    },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!job) {
    return next(new AppError('No job found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: job,
    },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    return next(new AppError('No job found with this id', 404));
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: null,
    },
  });
});

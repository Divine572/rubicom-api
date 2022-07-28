const express = require('express');

const authController = require('../controllers/auth.controllers');
const jobController = require('../controllers/job.controllers');

const router = express.Router();


router
  .route('/')
  .get(jobController.getAllJobs)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    jobController.createJob
  );

router
  .route('/:id')
  .get(jobController.getJob)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    jobController.updateJob
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    jobController.deleteJob
  );

module.exports = router;

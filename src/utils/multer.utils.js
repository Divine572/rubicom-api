const multer = require('multer');
const AppError = require('./error.utils');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (req.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;

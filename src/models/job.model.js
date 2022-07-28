const mongoose = require('mongoose');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    category: {
      type: String,
      required: [true, 'Please provide job category'],
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
    },
    jobType: {
      type: String,
      required: [true, 'Please provide job type'],
    },
    requirements: {
      type: String,
      required: [true, 'Please provide job requirements'],
    },
    responsibilities: {
      type: String,
      required: [true, 'Please provide job responsibilities'],
    },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Job', jobSchema);

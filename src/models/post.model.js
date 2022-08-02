const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a blog title'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Please provide a body for your blog'],
    },
    imageCover: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: [true, 'Post must belong to a user'],
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.index({ slug: 1 });

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

postSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt',
  });

  next();
});

module.exports = mongoose.model('Post', postSchema);

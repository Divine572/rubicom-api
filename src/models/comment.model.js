const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      // required: [true, 'Please comment should include a text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Comment should have user'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Comment should have user'],
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

commentSchema.index({ post: 1, user: 1 }, { unique: true });

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name',
  }).populate({
    path: 'post',
    select: 'title',
  });
});

module.exports = mongoose.model('Comment', commentSchema);

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    commentsNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostSchema);

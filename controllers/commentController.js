const { default: mongoose } = require('mongoose');
const CommentModel = require('../models/Comment.js');
const UserModel = require('../models/User.js');
const PostModel = require('../models/Post.js');
const io = require('../socket.js');

class CommentConroller {
  async getAll(req, res) {
    try {
      const comments = await CommentModel.find().exec();

      res.json(comments);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to get comments',
      });
    }
  }

  async getReplies(req, res) {
    try {
      const id = req.params.id;

      const { repliedComments } = await CommentModel.findById({ _id: id })
        .populate('repliedComments')
        .populate({
          path: 'repliedComments',
          populate: {
            path: 'user',
            model: 'User',
            select: 'avatarUrl',
          },
        })
        .exec();

      res.json(repliedComments);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to get comments',
      });
    }
  }

  async create(req, res) {
    try {
      const postId = req.params.postId;

      const doc = new CommentModel({
        user: req.userId,
        text: req.body.text,
      });
      const comment = await doc.save();

      await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          $push: { comments: comment._id },
          $inc: {
            commentsNumber: 1,
          },
        }
      );

      const post = await PostModel.findById(postId)
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User',
            select: ['userName', 'avatarUrl'],
          },
        })
        .exec();
      io.emit('receive-comments', {postId: postId, commentsNumber: post.commentsNumber});
      io.emit('receive-userComments', post.comments);

      res.json(comment);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to create comment',
      });
    }
  }

  async update(req, res) {
    try {
      await CommentModel.updateOne(
        {
          _id: req.params.id,
        },
        {
          text: req.body.text,
        }
      );

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to create comment',
      });
    }
  }

  async replyComment(req, res) {
    try {
      const postId = req.params.postId;
      const commentId = req.params.commentId;

      const doc = new CommentModel({
        user: req.userId,
        text: req.body.text,
      });
      await doc.save();

      await CommentModel.updateOne(
        {
          _id: commentId,
        },
        {
          $push: { repliedComments: doc },
        }
      );

      await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          $inc: {
            commentsNumber: 1,
          },
        }
      );

      const post = await PostModel.findById(postId)
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User',
            select: ['userName', 'avatarUrl'],
          },
        })
        .exec();
      io.emit('receive-comments', post.commentsNumber);

      io.emit('receive-userComments', post.comments);

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to create comment',
      });
    }
  }

  async remove(req, res) {
    try {
      await CommentModel.deleteOne({
        _id: req.params.id,
      });

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to create comment',
      });
    }
  }
}

module.exports = new CommentConroller();

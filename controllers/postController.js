const PostModel = require('../models/Post.js');
const UserModel = require('../models/User.js');
const { uploadToCloudinary } = require('../service/upload.service.js');
const bufferToDataURI = require('../utils/file.js');

class PostController {
  async create(req, res) {
    try {
      const { file } = req;
      if (!file) {
        console.log('File not found');
        res.status(404).json({
          message: 'File not found',
        });
        return;
      }

      const fileFormat = file.mimetype.split('/')[1];
      const { base64 } = bufferToDataURI(fileFormat, file.buffer);

      const imageDetails = await uploadToCloudinary(base64, fileFormat);

      const doc = new PostModel({
        imageUrl: imageDetails.url,
        text: req.body.text,
        user: req.userId,
      });

      const post = await doc.save();
      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to create post',
      });
    }
  }

  async getAll(req, res) {
    try {
      const posts = await PostModel.find().sort({ createdAt: 'desc' }).populate('user').exec();

      res.json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Can't get Posts",
      });
    }
  }

  async getOne(req, res) {
    try {
      const postId = req.params.id;

      const post = await PostModel.findOne({
        _id: postId,
      })
        .populate('user')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            model: 'User',
            select: ['userName', 'avatarUrl']
          },
        })
        .exec();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Can't get Post",
      });
    }
  }

  async remove(req, res) {
    try {
      const postId = req.params.id;

      await PostModel.deleteOne({
        _id: postId,
      });

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Can't get Post",
      });
    }
  }

  async update(req, res) {
    try {
      const postId = req.params.id;

      await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          imageUrl: req.body.imageUrl,
          text: req.body.text,
          likes: req.body.likes,
          comments: req.body.comments,
        }
      );

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Failed to update post',
      });
    }
  }

  async getUserPosts(req, res) {
    try {
      const userId = req.params.userId;

      const user = await UserModel.findById(userId).exec();

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      const post = await PostModel.find({ user: userId }).sort({ createdAt: 'desc' }).exec();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Can't get Post",
      });
    }
  }
}

module.exports = new PostController();

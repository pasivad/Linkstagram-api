const UserModel = require('../models/User.js');
const PostModel = require('../models/Post.js');
const CommentModel = require('../models/Comment.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bufferToDataURI = require('../utils/file.js');
const { uploadToCloudinary } = require('../service/upload.service.js');

class UserController {
   async registration(req, res) {
      try {
         // Hash password
         const password = req.body.password;
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(password, salt);
         // Creating user
         const doc = new UserModel({
            email: req.body.email,
            userName: req.body.userName,
            passwordHash: hash,
         });

         const user = await doc.save();
         // JWT token
         const token = jwt.sign(
            {
               _id: user._id,
            },
            'secret123',
            {
               expiresIn: '24h',
            }
         );
         // Response
         const { passwordHash, ...userData } = user._doc;

         res.json({
            ...userData,
            token,
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to register',
         });
      }
   }

   async login(req, res) {
      try {
         const user = await UserModel.findOne({ email: req.body.email });
         if (!user) {
            return res.status(404).json({
               message: 'User not found',
            });
         }

         const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
         if (!isValidPass) {
            return res.status(400).json({
               message: 'Incorrect email or password',
            });
         }

         // JWT token
         const token = jwt.sign(
            {
               _id: user._id,
            },
            process.env.SECRET_KEY,
            {
               expiresIn: '24h',
            }
         );

         // Response
         const { passwordHash, ...userData } = user._doc;

         res.json({
            ...userData,
            token,
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to login',
         });
      }
   }

   async getMe(req, res) {
      try {
         const user = await UserModel.findById(req.userId).exec();

         if (!user) {
            return res.status(404).json({
               message: 'User not found',
            });
         }

         const { passwordHash, ...userData } = user._doc;

         res.json(userData);
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'No permission',
         });
      }
   }

   async updateInfo(req, res) {
      try {
         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            {
               userName: req.body.userName,
               job: req.body.job,
               description: req.body.description,
            }
         );

         res.json({
            success: true,
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to update user info',
         });
      }
   }

   async updateAvatar(req, res) {
      try {
         const { file } = req;

         if (!file) {
            console.log('File not found');
            res.status(404).json({
               message: 'File not found',
            });
         }
         const fileFormat = file.mimetype.split('/')[1];
         const { base64 } = bufferToDataURI(fileFormat, file.buffer);

         const imageDetails = await uploadToCloudinary(base64, fileFormat);

         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            {
               avatarUrl: imageDetails.url,
            }
         );

         res.json({
            success: true,
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to update user avatar',
         });
      }
   }

   async likePost(req, res) {
      try {
         const postId = req.params.postId;

         const user = await UserModel.findById(req.userId).exec();
         user.likes.push(postId);
         const updatedLikes = user.likes;

         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            {
               likes: updatedLikes,
            }
         );

         await PostModel.updateOne(
            {
               _id: postId,
            },
            {
               $inc : {'likes' : 1}
            }
         );

         res.json({ success: true });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to like post',
         });
      }
   }

   async unlikePost(req, res) {
      try {
         const postId = req.params.postId;

         const user = await UserModel.findById(req.userId).exec();
         user.likes.splice(user.likes.indexOf(postId), 1);
         const updatedLikes = user.likes;

         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            {
               likes: updatedLikes,
            }
         );

         await PostModel.updateOne(
            {
               _id: postId,
            },
            {
               $inc : {'likes' : -1}
            }
         );

         res.json({ success: true });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to unlike post',
         });
      }
   }

   async likeComment(req, res) {
      try {
         const commentId = req.params.commentId;

         const user = await UserModel.findById(req.userId).exec();
         user.likedComments.push(commentId);
         const updatedLikes = user.likedComments;

         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            {
               likedComments: updatedLikes,
            }
         );

         await CommentModel.updateOne(
            {
               _id: commentId,
            },
            {
               $inc : {'likes' : 1}
            }
         );

         res.json({ success: true });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to like comment',
         });
      }
   }
   
   async unlikeComment(req, res) {
      try {
         const commentId = req.params.commentId;

         const user = await UserModel.findById(req.userId).exec();
         user.likedComments.splice(user.likes.indexOf(commentId), 1);
         const updatedLikes = user.likedComments;

         await UserModel.updateOne(
            {
               _id: req.userId,
            },
            {
               likedComments: updatedLikes,
            }
         );

         await CommentModel.updateOne(
            {
               _id: commentId,
            },
            {
               $inc : {'likes' : -1}
            }
         );

         res.json({ success: true });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'Failed to unlike comment',
         });
      }
   }

   async getUser(req, res) {
      try {
         const id = req.params.id

         const user = await UserModel.findById(id).exec();

         if (!user) {
            return res.status(404).json({
               message: 'User not found',
            });
         }

         const { passwordHash, userData } = user._doc;

         res.json({
            _id: user._id,
            userName: user.userName,
            avatarUrl: user.avatarUrl,
            job: user.job,
            description: user.description,
            followers: user.followers,
            following: user.following
         });
      } catch (err) {
         console.log(err);
         res.status(500).json({
            message: 'No permission',
         });
      }
   }
}

module.exports = new UserController();

const CommentModel = require('../models/Comment.js');
const PostModel = require('../models/Post.js');


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

   async create(req, res) {
      try {
         const postId = req.params.postId
         
         const doc = new CommentModel({
            user: req.userId,
            text: req.body.text
         })
         const comment = await doc.save()

         const post = await PostModel.findById(postId).exec();
         // console.log(comment._id)
         post.comments.push(comment._id);
         const updatedComments = post.comments;

         await PostModel.updateOne({
            _id: postId
         },
         {
            comments: updatedComments,
            $inc: {
               'commentsNumber' : 1
            }
         })


         res.json(comment)
      } catch (err) {
         console.log(err)
         res.status(500).json({
            message: "Failed to create comment"
         })
      }
   }

   async update(req, res) {
      try {
         await CommentModel.updateOne({
            _id: req.params.id
         },
         {
            text: req.body.text
         }
         )

         res.json({
            success: true
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({
            message: "Failed to create comment"
         })
      }
   }

   async remove(req, res) {
      try {
         await CommentModel.deleteOne({
            _id: req.params.id
         })

         res.json({
            success: true
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({
            message: "Failed to create comment"
         })
      }
   }
}

module.exports = new CommentConroller();

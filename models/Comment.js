const mongoose = require('mongoose')

const CommentsSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      text: {
         type: String,
         required: true
      },
      likes: {
         type: Number,
         required: true,
         default: 0
      },
      replyStatus: {
         type: Boolean,
         default: false,
         required: true
      }
   },
   {
      timestamps: true
   }
)

module.exports = mongoose.model('Comment', CommentsSchema)
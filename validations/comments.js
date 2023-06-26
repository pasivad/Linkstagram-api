const { body } = require('express-validator')

const commentValidator = [
   body('text', 'Enter text').isLength({min: 1}),
]

module.exports = commentValidator
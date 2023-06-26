const { body } = require('express-validator')

const registerValidator = [
   body('email', 'Incorrect email format').isEmail(),
   body('password', 'Password must contain 5 symbols').isLength({ min: 5 }),
   body('userName', 'Enter name').isLength({ min: 3 }),
   body('avatarUrl', 'Incorrect avatar Image url').optional().isURL(),
]
const loginValidator = [
   body('email', 'Incorrect email format').isEmail(),
   body('password', 'Password must contain 5 symbols').isLength({ min: 5 }),
]

module.exports = {
   registerValidator, 
   loginValidator
}
const { body } = require('express-validator');

const postCreateValidation = [body('text', 'Enter post text').isString({ min: 3 })];

module.exports = { postCreateValidation };

const Router = require('express');
const router = new Router();

const commentController = require('../controllers/commentController');
const checkAuth = require('../utils/checkAuth');
const commentValidator = require('../validations/comments');
const handleValidationErrors = require('../utils/handleValidationErrors');

router.get('/', commentController.getAll);
router.post('/:postId', checkAuth, commentValidator, handleValidationErrors, commentController.create);
router.patch('/:id', checkAuth, commentValidator, handleValidationErrors, commentController.update);
router.delete('/:id', checkAuth, commentController.remove);


module.exports = router;

const Router = require('express');
const router = new Router();

const commentController = require('../controllers/commentController');
const checkAuth = require('../utils/checkAuth');
const commentValidator = require('../validations/comments');
const handleValidationErrors = require('../utils/handleValidationErrors');

router.get('/', commentController.getAll);
router.get('/reply/:id', commentController.getReplies)
router.post('/:postId', checkAuth, commentValidator, handleValidationErrors, commentController.create);
router.patch('/:id', checkAuth, commentValidator, handleValidationErrors, commentController.update);
router.patch('/reply/:postId/:commentId', checkAuth, commentValidator, handleValidationErrors, commentController.replyComment);
router.delete('/:id', checkAuth, commentController.remove);

module.exports = router;

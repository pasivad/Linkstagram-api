const Router = require('express');
const router = new Router();

const checkAuth = require('../utils/checkAuth.js');
const validator = require('../validations/post.js');

const { upload } = require('../service/upload.service.js');

const PostController = require('../controllers/postController.js');
const handleValidationErrors = require('../utils/handleValidationErrors.js');

router.get('/', PostController.getAll);
router.get('/profile/:userId', PostController.getUserPosts);
router.get('/:id', PostController.getOne);

router.post(
   '/',
   checkAuth,
   upload.single('imageUrl'),
   validator.postCreateValidation,
   handleValidationErrors,
   PostController.create
);

router.delete('/:id', checkAuth, PostController.remove);
router.patch('/:id', checkAuth, validator.postCreateValidation, handleValidationErrors, PostController.update);

module.exports = router;

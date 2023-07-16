const Router = require('express');
const router = new Router();

const validator = require('../validations/auth.js');
const checkAuth = require('../utils/checkAuth.js');

const UserController = require('../controllers/userController.js');
const handleValidationErrors = require('../utils/handleValidationErrors.js');
const { upload } = require('../service/upload.service.js');

router.post('/register', validator.registerValidator, handleValidationErrors, UserController.registration);
router.post('/login', validator.loginValidator, handleValidationErrors, UserController.login);
router.get('/me', checkAuth, UserController.getMe);
router.get('/', UserController.getUser);
router.patch('/', checkAuth, UserController.updateInfo);
router.patch('/avatar', checkAuth, upload.single('avatarUrl'), UserController.updateAvatar);

router.patch('/like/:postId', checkAuth, UserController.likePost);
router.patch('/unlike/:postId', checkAuth, UserController.unlikePost);

router.patch('/likecom/:commentId', checkAuth, UserController.likeComment);
router.patch('/unlikecom/:commentId', checkAuth, UserController.unlikeComment);

module.exports = router;

const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter.js');
const postRouter = require('./postRouter.js');
const commentRouter = require('./commentRouter.js');

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/comment', commentRouter);

module.exports = router;

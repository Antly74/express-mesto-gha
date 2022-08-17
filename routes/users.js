const userRouter = require('express').Router();
const userControllers = require('../controllers/users');

userRouter.post('/', userControllers.createUser);
userRouter.get('/', userControllers.getUsers);
userRouter.get('/me', userControllers.getUsersMe);
userRouter.get('/:id', userControllers.getUsersById);
userRouter.patch('/me', userControllers.patchUserMe);
userRouter.patch('/me/avatar', userControllers.patchUserMeAvatar);

module.exports = userRouter;

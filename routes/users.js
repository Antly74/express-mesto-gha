const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userControllers = require('../controllers/users');

userRouter.get('/', userControllers.getUsers);
userRouter.get('/me', userControllers.getUsersMe);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), userControllers.getUsersById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), userControllers.patchUserMe);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i),
  }),
}), userControllers.patchUserMeAvatar);

module.exports = userRouter;

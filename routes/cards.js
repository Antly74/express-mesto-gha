const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardControllers = require('../controllers/cards');

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i).required(),
  }),
}), cardControllers.createCard);

cardRouter.get('/', cardControllers.getCards);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), cardControllers.deleteCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), cardControllers.likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), cardControllers.dislikeCard);

module.exports = cardRouter;

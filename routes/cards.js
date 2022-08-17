const cardRouter = require('express').Router();
const cardControllers = require('../controllers/cards');

cardRouter.post('/', cardControllers.createCard);
cardRouter.get('/', cardControllers.getCards);
cardRouter.delete('/:cardId', cardControllers.deleteCard);

cardRouter.put('/:cardId/likes', cardControllers.likeCard);
cardRouter.delete('/:cardId/likes', cardControllers.dislikeCard);

module.exports = cardRouter;

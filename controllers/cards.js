const { NotFoundError } = require('../utils/error');
const cardModel = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId: id } = req.params;
  cardModel
    .findByIdAndRemove(id)
    .orFail(() => {
      throw new NotFoundError(`Карточка с id = ${id} не найдена!`);
    })
    .then((card) => {
      if (card) {
        res.send({ message: 'Пост удален' });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId: id } = req.params;
  cardModel
    .findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Карточка с id = ${id} не найдена!`);
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId: id } = req.params;
  cardModel
    .findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Карточка с id = ${id} не найдена!`);
    })
    .then((card) => res.send(card))
    .catch(next);
};

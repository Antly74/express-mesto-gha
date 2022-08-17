const { NotFoundError, handleError } = require('../utils/error');
const cardModel = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => card.populate('owner'))
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => handleError(err, res));
};

module.exports.getCards = (req, res) => {
  cardModel
    .find({})
    .populate('owner likes')
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => {
      if (card) {
        res.send({ message: 'Пост удален' });
      } else {
        res.send({ message: 'Такого поста уже нет' });
      }
    })
    .catch((err) => handleError(err, res));
};

module.exports.likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError();
    })
    .populate('owner likes')
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
    .orFail(() => {
      throw new NotFoundError();
    })
    .populate('owner likes')
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
};

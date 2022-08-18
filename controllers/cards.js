const { NotFoundError } = require('../utils/error');
const cardModel = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

module.exports.getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: `${err.name}: ${err.message}` }));
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
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
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
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

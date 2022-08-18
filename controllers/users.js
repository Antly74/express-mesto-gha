const { NotFoundError } = require('../utils/error');
const userModel = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

module.exports.getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: `${err.name}: ${err.message}` }));
};

module.exports.getUsersMe = (req, res) => {
  userModel
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

module.exports.getUsersById = (req, res) => {
  userModel
    .findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

module.exports.patchUserMe = (req, res) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

module.exports.patchUserMeAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.status).send({ message: `${err.name}: ${err.message}` });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: `${err.name}: ${err.message}` });
      }
    });
};

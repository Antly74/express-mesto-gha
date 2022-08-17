const { NotFoundError, handleError } = require('../utils/error');
const userModel = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => handleError(err, res));
};

module.exports.getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

module.exports.getUsersMe = (req, res) => {
  userModel
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

module.exports.getUsersById = (req, res) => {
  userModel
    .findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

module.exports.patchUserMe = (req, res) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { returnDocument: 'after', runValidators: true },
    )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

module.exports.patchUserMeAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { returnDocument: 'after', runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
};

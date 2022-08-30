const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError, ValidationError } = require('../utils/error');
const userModel = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  // userModel.init() // для создания индекса, это нужно выполнить только один раз
  if (!password) {
    throw new ValidationError('Пароль не может быть пустым');
  } else if (password.length < 2 || password.length > 30) {
    throw new ValidationError('Пароль должен быть от 2 до 30 символов длинной');
  }

  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUsersMe = (req, res, next) => {
  const { _id: id } = req.user;
  userModel
    .findById(id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id=${id} не найден`);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  const { id } = req.params;

  userModel
    .findById(id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id=${id} не найден`);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.patchUserMe = (req, res, next) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id=${req.user._id} не найден`);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.patchUserMeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(`Пользователь с id=${req.user._id} не найден`);
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: 1000 * 60 * 60 * 24 * 7 },
      );
      // res.send({ token });
      res
        .cookie('jwt', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ token });
    })
    .catch(next);
};

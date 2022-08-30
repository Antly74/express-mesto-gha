const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { LoginError } = require('../utils/error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i,
  },
  email: {
    type: String,
    required: [true, 'Емайл не указан!'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `'${props.value}' неверный емайл!`,
    },
  },
  password: {
    type: String,
    required: [true, 'Пароль не задан'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function a(email, password) {
  return this
    .findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new LoginError();
    })
    .then((user) => bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new LoginError();
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { NotFoundError, handleError } = require('./utils/error');
const { login, createUser } = require('./controllers/users');
const auth = require('./middleware/auth');

// Слушаем 3000 порт
const { port = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser()); // получить куки
app.use(express.json()); // вместо bodyParser

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i),
    password: Joi.string().required().min(6),
    email: Joi.string().email().required(),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.all('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена!'));
});

app.use(errors());
app.use(handleError);

app.listen(port, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${port}`);
});

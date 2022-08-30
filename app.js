const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { handleError } = require('./utils/error');
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

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Такого маршрута не существует' });
});

app.use(errors());
app.use(handleError);

app.listen(port, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${port}`);
});

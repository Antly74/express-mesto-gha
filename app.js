const express = require('express');
const mongoose = require('mongoose');

// Слушаем 3000 порт
const { port = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json()); // вместо bodyParser

// хардкод авторизации, исправим в проектной работе 14
app.use((req, res, next) => {
  req.user = {
    _id: '62fd249ef59b38345098d309',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Такого маршрута не существует' });
});

app.listen(port, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${port}`);
});

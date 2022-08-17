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
    _id: '62fa72f666e49ba26465f847',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(port, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // console.log(`App listening on port ${port}`);
});

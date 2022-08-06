const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const DATABASE_URL = 'mongodb://localhost:27017/mestodb';
mongoose.connect(DATABASE_URL);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62ee5a616a64bb636c22fa59',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT);

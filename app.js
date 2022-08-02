require('dotenv').config();

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const express = require('express');
const path = require('path');

const PUBLIC_FOLDER = path.join(__dirname, 'public');
const app = express();

app.use(express.static(PUBLIC_FOLDER));

app.listen(PORT, () => {
  console.log(`server listen ${PORT}`);
});

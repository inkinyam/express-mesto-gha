const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ErrBadRequest, ErrConflict,
} = require('../errors/errors');

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/statuses');

// создаем нового пользователя
const addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        next(new ErrConflict('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

// логинимся и получаем токен
const login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret', { expiresIn: '7d' });
      res.send({ jwt: token });
    })
    .catch(next);
};

// получаем свои данные
const getMe = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send(user);
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// получаем конкретного пользователя по id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// обновляем имя и данные о пользователе
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  getMe,
};

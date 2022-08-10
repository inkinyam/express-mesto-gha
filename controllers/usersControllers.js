const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED, OK } = require('../utils/statuses');
const {
  ErrBadRequest, ErrConflict, ErrNotFound,
} = require('../errors/errors');

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
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest({ message: 'Вы указали некорректные данные при создании пользователя' }));
      }
      if (err.code === 11000) {
        next(new ErrConflict({ message: 'Пользователь с таким email уже существует' }));
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(OK).send(users);
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
      res.status(OK).send({ jwt: token });
    })
    .catch(next);
};

// получаем свои данные
const getMe = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new ErrNotFound({ message: 'Пользователь с указанным _id не найден' }));
      }
      return res.status(OK).send(user);
    })
    .catch(next);
};

// получаем конкретного пользователя по id
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new ErrNotFound({ message: 'Пользователь с указанным _id не найден' }));
      }
      return res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrBadRequest({ message: 'Вы указали некорректные данные' }));
      }
      next(err);
    });
};

// обновляем имя и данные о пользователе
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new ErrNotFound({ message: 'Пользователь с указанным _id не найден' }));
      }
      return res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest({ message: 'Вы указали некорректные данные при обновлении данных пользователя' }));
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new ErrNotFound({ message: 'Пользователь с указанным _id не найден' }));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest({ message: 'Вы указали некорректные данные при обновлении аватара' }));
      }
      next(err);
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

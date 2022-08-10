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
      res.status(CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest({ message: 'Вы указали некорректные данные при создании пользователя' }));
        return;
      }
      if (err.code === 11000) {
        next(new ErrConflict('Пользователь с таким email уже существует'));
        return;
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
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new ErrNotFound('Пользователь с указанным _id не найден'));
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
        return next(new ErrNotFound('Пользователь с указанным _id не найден'));
      }
      return res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrBadRequest('Вы указали некорректные данные'));
        return;
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
        return next(new ErrNotFound('Пользователь с указанным _id не найден'));
      }
      return res.status(OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные при обновлении данных пользователя'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new ErrNotFound('Пользователь с указанным _id не найден'));
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные при обновлении аватара'));
        return;
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

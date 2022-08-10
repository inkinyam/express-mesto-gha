const Card = require('../models/card');
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/statuses');

// создаем новую карточку
const addCard = (req, res) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// получаем все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// получаем конкретную карточку по id
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (!card.owner.equals(req.user._id)) {
        return res.status(SERVER_ERROR).send({ message: 'Невозможно удалить чужую карточку' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// ставим лайк на карточку
const putLikeOnCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.status(CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

// убираем лайк с карточки
const removeLikeFromCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Вы указали некорректные данные' });
      }
      return res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  addCard,
  getCards,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
};

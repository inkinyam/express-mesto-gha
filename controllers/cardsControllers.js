const Card = require('../models/card');
const { CREATED, OK } = require('../utils/statuses');

const {
  ErrBadRequest, ErrNotFound, ErrForbidden,
} = require('../errors/errors');

// создаем новую карточку
const addCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные при создании карточки'));
      }
      next(err);
    });
};

// получаем все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(OK).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrBadRequest('Вы указали некорректные данные'));
      }
      next(err);
    });
};

// получаем конкретную карточку по id
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new ErrNotFound('Карточка с указанным _id не найдена'));
      }
      if (!card.owner.equals(req.user._id)) {
        next(new ErrForbidden('Нельзя удалить карточку, которая была создана не Вами'));
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные карточки'));
      }
      next(err);
    });
};

// ставим лайк на карточку
const putLikeOnCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrNotFound('Карточка с указанным _id не найдена'));
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные карточки'));
      }
      next(err);
    });
};

// убираем лайк с карточки
const removeLikeFromCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new ErrNotFound('Карточка с указанным _id не найдена');
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные карточки'));
      }
      next(err);
    });
};

module.exports = {
  addCard,
  getCards,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
};

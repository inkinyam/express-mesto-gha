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
        return;
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
    .catch(next);
};

// получаем конкретную карточку по id
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ErrNotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ErrForbidden('Нельзя удалить карточку, которая была создана не Вами'));
      }
      return Card.deleteOne(card)
        .then(() => {
          res.status(OK).send(card);
        });
    })
    .catch(next);
};

// ставим лайк на карточку
const putLikeOnCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new ErrNotFound('Карточка с указанным _id не найдена'));
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Вы указали некорректные данные карточки'));
        return;
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
        return;
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

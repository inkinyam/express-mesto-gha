const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  addCard,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
} = require('../controllers/cardsControllers');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
}), addCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), putLikeOnCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), removeLikeFromCard);

module.exports = router;

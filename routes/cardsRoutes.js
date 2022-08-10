const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  addCard,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
} = require('../controllers/cardsControllers');

const validationObj = {
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
};

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
}), addCard);

router.delete('/:cardId', celebrate(validationObj), deleteCard);

router.put('/:cardId/likes', celebrate(validationObj), putLikeOnCard);

router.delete('/:cardId/likes', celebrate(validationObj), removeLikeFromCard);

module.exports = router;

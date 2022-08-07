const router = require('express').Router();

const {
  getCards,
  addCard,
  deleteCard,
  putLikeOnCard,
  removeLikeFromCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', addCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLikeOnCard);
router.delete('/:cardId/likes', removeLikeFromCard);

module.exports = router;

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
router.patch('/:cardId/likes', putLikeOnCard);
router.patch('/:cardId/likes', removeLikeFromCard);

module.exports = router;

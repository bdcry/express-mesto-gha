const cardsRouter = require('express').Router();
const {
  createCard, getCards, deleteCardsId, putLikesOnCards, deleteLikesFromCards,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:id', deleteCardsId);

cardsRouter.put('/cards/:id/likes', putLikesOnCards);
cardsRouter.delete('/cards/:id/likes', deleteLikesFromCards);

module.exports = cardsRouter;

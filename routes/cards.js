const cardsRouter = require('express').Router();
const { createCard, getCards, deleteCardsId } = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:id', deleteCardsId);

// cardsRouter.put('/cards/:cardId/likes', putLikesOnCards);
// cardsRouter.delete('/cards/:cardId/likes', deleteLikesOnCards);

module.exports = cardsRouter;

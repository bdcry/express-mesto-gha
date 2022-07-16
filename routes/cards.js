const cardsRouter = require('express').Router();
const { createCard, getCards, deleteCardsId } = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:id', deleteCardsId);

module.exports = cardsRouter;

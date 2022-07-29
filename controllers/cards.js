const Card = require('../models/card');

const BadRequest = require('../utils/errors/BadRequest');
const NotFound = require('../utils/errors/NotFound');

const { CORRECT_CODE, CREATE_CODE } = require('../utils/codes');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        throw new BadRequest('Данные не прошли валидацию на сервере');
      }
      next(error);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new NotFound('Карточки не созданы');
      }
      next(error);
    })
    .catch(next);
};

module.exports.deleteCardsId = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        throw new NotFound(`Карточка с указанным id: ${cardId} не существует`);
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest(`Карточка с id: ${cardId} не существует`);
      }
      next(error);
    })
    .catch(next);
};

module.exports.putLikesOnCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFound(`Карточка с указанным id:${cardId} не существует`);
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Карточка не существует');
      }
      next(error);
    })
    .catch(next);
};

module.exports.deleteLikesFromCards = (req, res, next) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        throw new NotFound(`Карточка с указанным id:${cardId} не существует`);
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequest('Карточка не существует');
      }
      next(error);
    })
    .catch(next);
};

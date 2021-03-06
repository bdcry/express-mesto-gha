const Card = require('../models/card');

const {
  CORRECT_CODE, CREATE_CODE, NOTFOUNDERROR, INTERNALSERVERERROR, BADREQUEST,
} = require('../utils/codes');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(CREATE_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(BADREQUEST).send({ message: 'Данные не прошли валидацию на сервере' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(CORRECT_CODE).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(NOTFOUNDERROR).send({ message: 'Карточка не существует' });
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.deleteCardsId = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        res.status(NOTFOUNDERROR).send({ message: `Карточка с указанным id:${cardId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BADREQUEST).send({ message: `Карточка с id:${cardId} не существует` });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.putLikesOnCards = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(NOTFOUNDERROR).send({ message: `Карточка с указанным id:${cardId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BADREQUEST).send({ message: 'Карточка не существует' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.deleteLikesFromCards = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      if (!data) {
        res.status(NOTFOUNDERROR).send({ message: `Карточка с указанным id:${cardId} не существует` });
        return;
      }
      res.status(CORRECT_CODE).send(data);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(BADREQUEST).send({ message: 'Карточка не существует' });
        return;
      }
      res.status(INTERNALSERVERERROR).send({ message: `Ошибка сервера ${error}` });
    });
};

const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((error) => {
      if (error.name === 'CardNameError') {
        res.status(404).send({ message: 'Карточка не существует' });
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.deleteCardsId = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CardIdError') {
        res.status(404).send({ message: `Карточка с id:${cardId} не найдена` });
      }
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.putLikesOnCards = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

module.exports.deleteLikesFromCards = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send({ message: `Ошибка сервера ${error}` });
    });
};

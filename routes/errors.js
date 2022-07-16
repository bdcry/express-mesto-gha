const errorRouter = require('express').Router();

errorRouter.all('*', (req, res) => {
  res.status(404).send({ message: 'Тут ничего нет, пока!' });
});

module.exports = errorRouter;

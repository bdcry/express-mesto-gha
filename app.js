const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorRouter = require('./routes/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!');
});

app.use((req, res, next) => {
  req.user = {
    _id: '62d1b0aca1ce5690a32086a0',
  };

  next();
});

app.use(express.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.all('*', errorRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

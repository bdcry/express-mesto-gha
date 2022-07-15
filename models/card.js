const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String, // строка
    required: true, // обязательное поле
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId
    required: true, // обязательное поле
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, // ObjectId
    default: [], // пустой массив
  }],
  createdAt: {
    type: Date, // дата
    default: Date.now(), // значение по умолчанию
  },
});

module.exports = mongoose.model('card', cardSchema);

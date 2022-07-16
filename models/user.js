const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: true, // обязательное поле
    minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
  },
  about: {
    type: String, // строка
    required: [true, 'Это обязательное поле'], // обязательное поле
    minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
  },
  avatar: {
    type: String, // строка
    required: [true, 'Это обязательное поле'], // обязательное поле
  },
}, { versionKey: false });
module.exports = mongoose.model('User', userSchema);

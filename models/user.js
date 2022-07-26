const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  email: {
    type: String, // строка
    required: [true, 'Это обязательное поле'], // обязательное поле
    unique: true, // так в базе не окажется несколько пользователей с одинаковой почтой
  },
  password: {
    type: String, // строка
    rrequired: [true, 'Это обязательное поле'], // обязательное поле
    select: false, // исключаем возврат хеш пароля из базы
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};
module.exports = mongoose.model('User', userSchema);

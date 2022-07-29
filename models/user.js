const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizationError = require('../utils/errors/AuthorizationError');

// {
//   "email": "bdcry@bdcry.ru",
//   "password": "qwerty123456"
// }

// {
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmU
//  yODljYjE5NjNkZTc3MjJhMDk1ZTEiLCJpYXQiOjE2NTkwMTM1OTMsImV4cCI6MT
// Y1OTYxODM5M30.Bi46IUdmcwhXZqgdkPZDjR1BAs0TKJc8W_UHWoh092U"
// }

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // строка
      minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
      maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
      default: 'Жак-Ив Кусто', // значение по умолчанию
    },
    about: {
      type: String, // строка
      minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
      maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
      default: 'Исследователь', // значение по умолчанию
    },
    avatar: {
      type: String, // строка
      default:
        'https://pictures.s3.yandex.net/https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png/jacques-cousteau_1604399756.pnghttps://images.unsplash.com/photo-1563823263008-ec7877629ba0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', // значение по умолчанию
      validate: {
        validator(v) {
          return /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            v,
          );
        },
        message: 'Ошибка. Ссылка не подходит для установки на аватар :(',
      },
    },
    email: {
      type: String, // строка
      required: [true, 'Это обязательное поле'], // обязательное поле
      unique: true, // так в базе не окажется несколько пользователей с одинаковой почтой
      validate: {

        validator(v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} не является email`,
      },
    },
    password: {
      type: String, // строка
      required: [true, 'Это обязательное поле'], // обязательное поле
      select: false, // исключаем возврат хеш пароля из базы
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function func(email, password) {
  return this.findOne({ email })
    .select('+password') // скрываем пароль
    .then((user) => {
      if (!user) {
        throw new AuthorizationError(
          'Похоже, что почта или пароль некорректные!',
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthorizationError(
            'Похоже, что почта или пароль некорректные!',
          );
        }

        return user;
      });
    });
};
module.exports = mongoose.model('User', userSchema);

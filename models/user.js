const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // строка
    required: true, // обязательное поле
    minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
    default: 'Жак-Ив Кусто', // значение по умолчанию
  },
  about: {
    type: String, // строка
    required: [true, 'Это обязательное поле'], // обязательное поле
    minlength: [2, 'Должно быть от 2 до 30 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Должно быть от 2 до 30 символов'], // а максимальная — 30 символов
    default: 'Исследователь', // значение по умолчанию
  },
  avatar: {
    type: String, // строка
    required: [true, 'Это обязательное поле'], // обязательное поле
    default: 'https://images.unsplash.com/photo-1563823263008-ec7877629ba0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80', // значение по умолчанию
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
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password') // скрываем пароль
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

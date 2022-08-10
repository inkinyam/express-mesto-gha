const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { ErrAutorization } = require('../errors/errors');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (item) => isEmail(item),
        message: 'Вы указали некорректную почту',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrAutorization('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrAutorization('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

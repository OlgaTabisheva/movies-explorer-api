const mongoose = require('mongoose');
const { urlRegex } = require('../utils');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
   ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
   // ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

//movieSchema.path('image').validate((val) => urlRegex.test(val), 'Invalid URL.');
//movieSchema.path('trailerLink').validate((val) => urlRegex.test(val), 'Invalid URL.');
//movieSchema.path('thumbnail').validate((val) => urlRegex.test(val), 'Invalid URL.');
module.exports = mongoose.model('movie', movieSchema);

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { urlRegex } = require('../utils');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required().min(2).max(130),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),

  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

module.exports.moviesRouter = router;

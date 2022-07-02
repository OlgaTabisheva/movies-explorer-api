
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovies
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country:Joi.string().required().min(2).max(30),
    director:Joi.string().required().min(2).max(30),
    duration:Joi.number().required(),
    year:Joi.number().required(),
    description:Joi.string().required().min(2).max(130),
    image:Joi.string().required().min(2).max(80),
    trailer:Joi.string().required().min(2).max(80),
    thumbnail:Joi.string().required().min(2).max(80),
    movieId:Joi.string().hex(),
    nameRU:Joi.string().required().min(2).max(30),
    nameEN:Joi.string().required().min(2).max(30),
    //length(24)

  }),
}), createMovies);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovies);

module.exports.moviesRouter = router;


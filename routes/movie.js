
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovies, deleteMovies
} = require('../controllers/moves');

router.get('/moves', getMovies);
router.post('/moves', celebrate({
  body: Joi.object().keys({
    country:Joi.string().required().min(2).max(30),
    director:Joi.string().required().min(2).max(30),
    duration:Joi.number().required(),
    year:Joi.number().required(),
    description:Joi.string().required().min(2).max(30),
    image:Joi.string().required().min(2).max(30),
    trailer:Joi.string().required().min(2).max(30),
    nameRU:Joi.string().required().min(2).max(30),
    nameEN:Joi.string().required().min(2).max(30),
    thumbnail:Joi.string().required().min(2).max(30),
    movieId:Joi.string().hex().length(24),
    name: Joi.string().required().min(2).max(30),

  }),
}), createMovies);
router.delete('/moves/_id', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovies);

module.exports.moviesRouter = router;


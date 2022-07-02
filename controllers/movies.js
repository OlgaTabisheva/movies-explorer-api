const mongoose = require('mongoose');
const movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const RequestErr = require('../errors/request-err');
const ForbiddenErr = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const createMovies = (req, res, next) => {
  console.log("01")
  const { nameEN, nameRU, movieId, thumbnail, trailer, image, description, year, duration, director, country, } = req.body;
  const owner = req.user;
  if (!nameRU || !year) {
    console.log("02")
    throw new RequestErr('Данные карточки заполненны не полностью');
  }
  console.log("03")
  return movie.create({ nameEN, nameRU, movieId, thumbnail, trailer, image, description, year, duration, director, country, owner })

    .then((newCard) => res.send(newCard))
    .catch((err) => next(err));
};

async function deleteMovies(req, res, next) {
  movie.findOne({ _id: req.params.movieId })
    .then((thisMovie) => {
      if (!thisMovie) {
        throw new NotFoundError('Фильм не найден');
      } else if (!thisMovie.owner._id.equals(req.user._id)) {
        throw new ForbiddenErr('Чужой фильм');
      }
      return movie.findByIdAndRemove(req.params.movieId)
        .then((newMovie) => {
          if (newMovie === null) {
            throw new NotFoundError('Фильм не найден');
          }
          res.send({ newMovie });
        });
    })
    .catch((err) => next(err));
}

module.exports = {
  createMovies,
  getMovies,
  deleteMovies,

};

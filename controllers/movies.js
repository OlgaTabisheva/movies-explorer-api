const movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenErr = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  const owner = req.user;
  movie.find({owner})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    nameEN,
    nameRU,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
  } = req.body;
  const owner = req.user;
  return movie.create({
    nameEN,
    nameRU,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
    owner,
  })
    .then((newMovie) => res.send(newMovie))
    .catch((err) => next(err));
};

async function deleteMovie(req, res, next) {
  movie.findOne({ movieId: req.params.Id , owner: req.user._id})
    .then((thisMovie) => {
      if (!thisMovie) {
        throw new NotFoundError('Фильм не найден');
      } else if (!thisMovie.owner._id.equals(req.user._id)) {
        throw new ForbiddenErr('Чужой фильм');
      }
      return movie.findByIdAndRemove(thisMovie._id)
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
  createMovie,
  getMovies,
  deleteMovie,
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const user = require('../models/user');
const RequestErr = require('../errors/request-err');
const NotAutErr = require('../errors/not-aut-err');
const ServerErr = require('../errors/server-err');
const ConflictErr = require('../errors/conflict-err');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((newUser) => {
      const outUser = {
        name: newUser.name,
        _id: newUser._id,
      };
      res.send({ data: outUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(',');
        throw new RequestErr(`${fields} не корректно`);
      }
      if (err.code === 11000) {
        throw new ConflictErr('пользователь существует');
      }
      throw new ServerErr('Ошибка сервера');
    })
    .catch((err) => next(err));
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => {
      res.send({
        name: newUser.name,
        email: newUser.email,
      });
    })
    .catch((err) => next(err));
};

const getUserMe = (req, res, next) => {
  const { _id } = req.user;
  user.findOne(
    { _id },
  )
    .then((newUser) => {
      res.send({
        name: newUser.name,
        email: newUser.email,
      });
    })
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  user.findOne({ email }).select('+password')
    .then((userM) => {
      if (!userM) {
        // перейдём в .catch, отклонив промис
        throw new NotAutErr('неверный пользователь или пароль');
      }
      return bcrypt.compare(password, userM.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAutErr('неверный пользователь или пароль');
          }
          return userM;
        });
    })
    .then((data) => {
      res.send({
        token: jwt.sign({ _id: data._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  patchUser,
  login,
  getUserMe,
};

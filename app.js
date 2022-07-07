const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const { userRouter } = require('./routes/user');
const { moviesRouter } = require('./routes/movie');
const { registerRouter } = require('./routes/registration');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

// error.log and request.log
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
// app.use(cors(corsOptions))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');

  if (req.method === 'OPTIONS') {
    return res.send();
  }
  return next();
});

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(registerRouter);
app.use(auth, userRouter);
app.use(auth, moviesRouter);
app.use(auth, (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message,
    });
  next();
});

const { NODE_ENV, MONGO_PATH } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGO_PATH : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(PORT, () => {
  console.log('Сервер запущен');
});

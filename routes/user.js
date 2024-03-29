const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  patchUser, getUserMe,
} = require('../controllers/users');

router.get('/users/me', getUserMe);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2),
    name: Joi.string().required().min(2).max(30),
  }),
}), patchUser);

module.exports.userRouter = router;

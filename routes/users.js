const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUsersId, patchUserProfile, patchUserAvatar, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), getUsersId);

usersRouter.patch('/users/me', patchUserProfile);
usersRouter.patch('/users/me/avatar', patchUserAvatar);

module.exports = usersRouter;

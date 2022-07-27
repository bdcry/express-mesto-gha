const usersRouter = require('express').Router();
const {
  getUsers, getUsersId, patchUserProfile, patchUserAvatar, getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUsersId);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.patch('/users/me', patchUserProfile);
usersRouter.patch('/users/me/avatar', patchUserAvatar);

module.exports = usersRouter;

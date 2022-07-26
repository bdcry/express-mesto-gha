const usersRouter = require('express').Router();
const {
  createUser, getUsers, getUsersId, patchUserProfile, patchUserAvatar, login,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:id', getUsersId);

usersRouter.patch('/users/me', patchUserProfile);
usersRouter.patch('/users/me/avatar', patchUserAvatar);

usersRouter.post('/signin', login);

module.exports = usersRouter;

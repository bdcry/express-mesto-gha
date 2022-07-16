const usersRouter = require('express').Router();
const {
  createUser, getUsers, getUsersId, patchUserProfile, patchUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:id', getUsersId);

usersRouter.patch('/users/me', patchUserProfile);
usersRouter.patch('/users/me/avatar', patchUserAvatar);

module.exports = usersRouter;

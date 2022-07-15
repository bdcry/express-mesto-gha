const usersRouter = require('express').Router();
const { createUser, getUsers, getUsersId } = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:id', getUsersId);

module.exports = usersRouter;

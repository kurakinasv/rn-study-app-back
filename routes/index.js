const { Router } = require('express');

const authRouter = require('./auth.router');
const noteRouter = require('./note.router');
const echoRouter = require('./echo.router');

const router = Router();

const initRoutes = (app) => {
  router.use('/auth', authRouter);
  router.use('/note', noteRouter);
  router.use('/', echoRouter);

  app.use('/api', router);
};

module.exports = initRoutes;

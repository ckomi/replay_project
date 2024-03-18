module.exports = app => {
  const auth = require('../controllers/auth.controller');
  var router = require('express').Router();

  router.post('/login', auth.login);
  router.get("/checkUserBlocked", auth.checkUserBlocked);
  app.use('/api/auth', router);
};


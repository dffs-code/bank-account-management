const { Router } = require('express');
const AccountController = require('../controllers/AccountController');

const router = Router();

router
  .get('/accounts', AccountController.index)
  .get('/accounts/:id', AccountController.show)
  .post('/account', AccountController.create)
  .post('/account/deposit', AccountController.deposit)
  .post('/account/withdrawal', AccountController.withdrawal)
  .post('/account/:id', AccountController.changePassword);

module.exports = router;
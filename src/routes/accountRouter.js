const { Router } = require('express');
const AccountController = require('../controllers/AccountController');
const AccountDomain = require('../domains/AccountDomain');

const router = Router();

router
  .get('/accounts', AccountController.index)
  .get('/accounts/:id', AccountController.show)
  .post('/account', AccountDomain.store, AccountController.create)
  .post('/account/deposit', AccountDomain.deposit, AccountController.updateBalance)
  // .post('/account/withdrawal', AccountDomain.withdrawal, AccountController.updateBalance)
  .post('/account/:id',  AccountDomain.changePassword, AccountController.changePassword);

module.exports = router;
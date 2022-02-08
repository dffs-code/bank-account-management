const { Router } = require('express');
const TransferController = require('../controllers/TransferController');
const TransferDomain = require('../domains/TransferDomain');


const router = Router();

router
  .get('/transfers', TransferController.index)
  .get('/transfers/:id', TransferController.show)
  .post('/transfer', TransferDomain.store, TransferController.create)

module.exports = router;
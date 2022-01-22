const { Router } = require('express');
const TransferController = require('../controllers/TransferController');

const router = Router();

router
  .get('/transfers', TransferController.index)
  .get('/transfers/:id', TransferController.show)
  .post('/transfer', TransferController.create)

module.exports = router;
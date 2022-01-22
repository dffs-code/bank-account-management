const { Router } = require('express');
const TransferController = require('../controllers/TransferController');

const router = Router();

router
  .post('/transfer', TransferController.create)
  .get('/transfers', TransferController.index);

module.exports = router;
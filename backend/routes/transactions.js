const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction, getDashboardData, autoCategorize } = require('../controllers/transactionController');

router.post('/categorize', autoCategorize);
router.get('/dashboard', getDashboardData);
router.get('/', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;

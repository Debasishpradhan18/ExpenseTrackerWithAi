const express = require('express');
const router = express.Router();
const { getInsights, postChat } = require('../controllers/insightController');

router.get('/', getInsights);
router.post('/chat', postChat);

module.exports = router;

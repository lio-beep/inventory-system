const express = require('express');
const router = express.Router();
const { getReport } = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getReport);

module.exports = router;
const express = require('express');
const router = express.Router();

const { getAdminStats } = require('../controllers/adminController');
const verifyFBToken = require('../middleware/verifyFBToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Admin stats
router.get('/stats', verifyFBToken, verifyAdmin, getAdminStats);

module.exports = router;
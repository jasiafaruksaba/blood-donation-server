const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  handlePaymentSuccess
} = require('../controllers/paymentController');

const verifyFBToken = require('../middleware/verifyFBToken');

// Create payment
router.post('/', verifyFBToken, createPayment);

// Get all payments
router.get('/', verifyFBToken, getAllPayments);

// Payment success webhook
router.get('/success', handlePaymentSuccess);

module.exports = router;
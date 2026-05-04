const express = require('express');
const router = express.Router();
const {
  createDonationRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  updateRequest,
  deleteRequest
} = require('../controllers/donationController');

const verifyFBToken = require('../middleware/verifyFBToken');
const verifyActive = require('../middleware/verifyActive');
const verifyVolunteer = require('../middleware/verifyVolunteer');

// Create donation request
router.post('/', verifyFBToken, verifyActive, createDonationRequest);

// Get my requests
router.get('/my/:email', verifyFBToken, verifyActive, getMyRequests);

// Get all requests (Admin/Volunteer/Public)
router.get('/',  getAllRequests);

// Get single request
router.get('/:id', verifyFBToken, getRequestById);

// Update status (Volunteer/Admin)
router.patch('/:id/status', verifyFBToken, verifyVolunteer, updateRequestStatus);

// Update request (Owner only)
router.patch('/:id', verifyFBToken, verifyActive, updateRequest);

// Delete request (Owner only)
router.delete('/:id', verifyFBToken, verifyActive, deleteRequest);

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { 
//   createDonationRequest, 
//   getMyRequests, 
//   getAllRequests, 
//   updateRequestStatus, 
//   deleteRequest,
//   getRequestById 
// } = require('../controllers/donationController');

// const verifyFBToken = require('../middleware/verifyFBToken');
// const verifyActive = require('../middleware/verifyActive');
// const verifyVolunteer = require('../middleware/verifyVolunteer');

// // Create donation request
// router.post("/", verifyFBToken, verifyActive, createDonationRequest);  // ✅ Fixed

// // Get single request
// router.get("/:id", verifyFBToken, getRequestById);

// // Get my requests
// router.get("/my/:email", verifyFBToken, verifyActive, getMyRequests);

// // Get all requests
// router.get("/", verifyFBToken, getAllRequests);  // ✅ Fixed

// // Update status
// router.patch("/:id", verifyFBToken, verifyVolunteer, updateRequestStatus);

// // Delete request
// router.delete("/:id", verifyFBToken, verifyActive, deleteRequest);

// module.exports = router;  // ✅ Export
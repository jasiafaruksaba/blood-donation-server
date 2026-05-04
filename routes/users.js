const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,        // ✅ Login add করুন
  getMeUser,
  updateOwnProfile,
  getAllUsers,
  updateUser,
  searchDonors
} = require('../controllers/userController');

const verifyFBToken = require('../middleware/verifyFBToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyActive = require('../middleware/verifyActive');
// ✅ Public routes
router.post('/register', createUser);     // POST /api/users/register
router.post('/login', loginUser);         // POST /api/users/login
router.get('/search-donors', searchDonors);

// ✅ Protected routes  
router.get('/me', verifyFBToken, verifyActive, getMeUser);  // ✅ Working
router.patch('/me', verifyFBToken, verifyActive, updateOwnProfile);  // ✅ Owner only

// Admin routes
router.get('/', verifyFBToken, verifyAdmin, getAllUsers);
router.patch('/:email', verifyFBToken, verifyAdmin, updateUser);

module.exports = router;
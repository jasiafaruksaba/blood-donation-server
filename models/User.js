// const express = require('express');
// const router = express.Router();
// const { 
//   createUser, 
//   getMeUser,
//   updateOwnProfile,
//   searchDonors,
//   getAllUsers,
//   updateUser 
// } = require('../controllers/userController');

// const verifyFBToken = require('../middleware/verifyFBToken');
// const verifyAdmin = require('../middleware/verifyAdmin');

// // Public
// router.post("/", createUser);
// router.get("/search", searchDonors);

// // Protected
// router.get("/me", verifyFBToken, getMeUser);
// router.patch("/me", verifyFBToken, updateOwnProfile);

// // Admin
// router.get("/", verifyFBToken, verifyAdmin, getAllUsers);
// router.patch("/:email", verifyFBToken, verifyAdmin, updateUser);

// module.exports = router;  // ✅ Router export
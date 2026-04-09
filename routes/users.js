import express from "express";
import { 
  createJWT, 
  getAllUsers, 
  getUserByEmail, 
  updateUser, 
  searchDonors 
} from "../controllers/userController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/jwt", createJWT);
router.get("/", verifyToken, getAllUsers);
router.get("/search", searchDonors);           // Public search
router.get("/:email", verifyToken, getUserByEmail);
router.patch("/:email", verifyToken, updateUser);

export default router;
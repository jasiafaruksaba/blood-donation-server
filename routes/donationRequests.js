import express from "express";
import { 
  createDonationRequest, 
  getMyRequests, 
  getAllRequests, 
  updateRequestStatus, 
  deleteRequest 
} from "../controllers/donationController.js";

import verifyToken from "../middleware/verifyToken.js";
import verifyActive from "../middleware/verifyActive.js";

const router = express.Router();

router.post("/", verifyToken, verifyActive, createDonationRequest);
router.get("/my/:email", verifyToken, getMyRequests);
router.get("/", verifyToken, getAllRequests);           // Admin + Volunteer
router.patch("/:id", verifyToken, updateRequestStatus);
router.delete("/:id", verifyToken, deleteRequest);

export default router;
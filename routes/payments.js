import express from "express";
import { 
  getAllPayments, 
  createPayment 
} from "../controllers/paymentController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getAllPayments);
router.post("/", verifyToken, createPayment);

export default router;
import express from "express";
import {
  getMemberProfile,
  updateMemberProfile,
  getMemberPayments,
  renewMembership,
  createPaymentOrder,
} from "../controllers/memberController.js";
import { verifyToken, isMember } from "../middleware/auth.js";

const router = express.Router();

// Apply auth middlewares
router.use(verifyToken, isMember);

router.get("/me", getMemberProfile);
router.put("/me", updateMemberProfile);
router.get("/payments", getMemberPayments);
router.post("/renew", renewMembership);
router.post("/create-payment-order", createPaymentOrder);

export default router;

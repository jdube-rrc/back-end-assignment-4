import express, { Router } from "express";
import { setCustomClaims } from "../controller/adminController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router: Router = express.Router();

// Only allow users with admin or manager roles to set claims
router.post("/set-claims", authenticate, authorize({ hasRole: ["manager", "admin"] }), setCustomClaims);

export default router;

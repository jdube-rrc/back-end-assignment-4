import express, { Router } from "express";
import { getUserDetails } from "../controller/userController";
import authenticate from "../middleware/authenticate";

const router: Router = express.Router();

// Get user details - requires authentication, user info will be fetched by UID param
router.get("/:id", authenticate, getUserDetails);

export default router;

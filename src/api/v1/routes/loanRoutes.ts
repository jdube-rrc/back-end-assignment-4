import express, { Router } from "express";
import * as loanController from "../controller/loanController";

const router: Router = express.Router();

/**
 * GET /api/v1/loans
 * Retrieve all loan applications
 * Required role: officer, manager
 */
router.get("/", loanController.getAllLoanApplications);

/**
 * POST /api/v1/loans
 * Create a new loan application
 * Required role: user
 */
router.post("/", loanController.createLoanApplication);

/**
 * PUT /api/v1/loans/:id/review
 * Review a loan application
 * Required role: officer
 */
router.put("/:id/review", loanController.reviewLoanApplication);

/**
 * PUT /api/v1/loans/:id/approve
 * Approve a loan application
 * Required role: manager
 */
router.put("/:id/approve", loanController.approveLoanApplication);

export default router;
import express, { Router } from "express";
import * as loanController from "../controller/loanController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router: Router = express.Router();

/**
 * GET /api/v1/loans
 * Retrieve all loan applications
 * Required role: officer, manager
 */
router.get("/", authenticate, authorize({ hasRole: ["manager", "officer"] }), loanController.getAllLoanApplications);

/**
 * GET /api/v1/loans/:id
 * Retrieve a single loan application by id
 * Required role: officer, manager
 */
router.get("/:id", authenticate, authorize({ hasRole: ["manager", "officer"] }), loanController.getLoanApplicationById);

/**
 * POST /api/v1/loans
 * Create a new loan application
 * Required role: user
 */
router.post("/", authenticate, authorize({ hasRole: ["user"] }), loanController.createLoanApplication);

/**
 * PUT /api/v1/loans/:id/review
 * Review a loan application
 * Required role: officer
 */
router.put("/:id/review", authenticate, authorize({ hasRole: ["officer"] }), loanController.reviewLoanApplication);

/**
 * PUT /api/v1/loans/:id/approve
 * Approve a loan application
 * Required role: manager
 */
router.put("/:id/approve", authenticate, authorize({ hasRole: ["manager"] }), loanController.approveLoanApplication);

/**
 * DELETE /api/v1/loans/:id
 * Delete a loan application (RESTful)
 * Required role: manager
 */
router.delete("/:id", authenticate, authorize({ hasRole: ["manager"] }), loanController.deleteLoanApplication);

export default router;
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../constants/httpConstants';
import { successResponse } from '../models/responseModel';

/**
 * GET /api/v1/loans
 * Retrieve all loan applications
 * Role: officer, manager
 */
export const getAllLoanApplications = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.OK).json(
    successResponse(
      [
        { id: 1, amount: 50000, dateCreated: '2025-10-01', status: 'pending' },
        { id: 2, amount: 75000, dateCreated: '2025-10-05', status: 'reviewed' },
        { id: 3, amount: 100000, dateCreated: '2025-10-10', status: 'approved' },
      ],
      'Loan applications retrieved successfully'
    )
  );
};

/**
 * POST /api/v1/loans
 * Create a new loan application
 * Role: user
 */
export const createLoanApplication = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.CREATED).json(
    successResponse(
      {
        id: 4,
        amount: 120000,
        dateCreated: new Date().toISOString(),
        status: 'pending',
      },
      'Loan application created successfully'
    )
  );
};

/**
 * PUT /api/v1/loans/:id/review
 * Review a loan application
 * Role: officer
 */
export const reviewLoanApplication = (req: Request, res: Response): void => {
  const { id } = req.params;
  res.status(HTTP_STATUS.OK).json(
    successResponse(
      {
        id,
        status: 'reviewed',
        reviewedAt: new Date().toISOString(),
        reviewNotes: 'Application reviewed and pending approval',
      },
      'Loan application reviewed successfully'
    )
  );
};

/**
 * PUT /api/v1/loans/:id/approve
 * Approve a loan application
 * Role: manager
 */
export const approveLoanApplication = (req: Request, res: Response): void => {
  const { id } = req.params;
  res.status(HTTP_STATUS.OK).json(
    successResponse(
      {
        id,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvalNotes: 'Loan application approved',
      },
      'Loan application approved successfully'
    )
  );
};

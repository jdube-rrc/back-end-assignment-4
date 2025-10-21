import { Request, Response, NextFunction } from "express";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "src/constants/httpConstants";
import { Loan } from "../models/loanModel";

export const createLoan = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const loan: Loan[] = []
        res.status(HTTP_STATUS.OK).json(
            successResponse(loan, "Loan created successfully")
        );
    } catch (error: unknown) {
        next(error);
    };
};
import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { AppError, RepositoryError, ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

export const setCustomClaims = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { uid, claims } = req.body;

    if (!uid || !claims) {
      // Use a ServiceError so the centralized error handler can format the response
      throw new ServiceError("uid and claims are required", "BAD_REQUEST", HTTP_STATUS.BAD_REQUEST);
    }

    await auth.setCustomUserClaims(uid, claims);

    res.status(HTTP_STATUS.OK).json(
      successResponse({}, `Custom claims (roles) set for user: ${uid}`)
    );
  } catch (error: unknown) {
    // If it's an AppError we can forward it directly for consistent handling
    if (error instanceof AppError) {
      return next(error);
    }

    // Wrap unexpected errors in a RepositoryError so they have a consistent shape/status
    const message = `Failed to set custom claims: ${getErrorMessage(error)}`;
    const code = getErrorCode(error);
    return next(new RepositoryError(message, code, HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

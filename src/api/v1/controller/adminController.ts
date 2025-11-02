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
      throw new ServiceError("uid and claims are required", "BAD_REQUEST", HTTP_STATUS.BAD_REQUEST);
    }

    await auth.setCustomUserClaims(uid, claims);

    res.status(HTTP_STATUS.OK).json(
      successResponse({}, `Custom claims (roles) set for user: ${uid}`)
    );
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return next(error);
    }

    const message = `Failed to set custom claims: ${getErrorMessage(error)}`;
    const code = getErrorCode(error);
    return next(new RepositoryError(message, code, HTTP_STATUS.INTERNAL_SERVER_ERROR));
  }
};

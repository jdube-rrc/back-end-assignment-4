import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "User id is required" });
      return;
    }

    const userRecord = await auth.getUser(id);
    res.status(HTTP_STATUS.OK).json(successResponse(userRecord));
  } catch (error: unknown) {
    next(error);
  }
};

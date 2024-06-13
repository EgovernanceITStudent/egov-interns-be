import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import HttpException from "../utils/http.exception";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authCheck = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const secretKey = process.env.SECRETKEY as string;
    const payload = jwt.verify(token, secretKey) as {
      uid: string;
    };

    req.userId = payload.uid;

    next();
  } catch (error: any) {
    throw new HttpException(401, "Unauthorized ");
  }
};

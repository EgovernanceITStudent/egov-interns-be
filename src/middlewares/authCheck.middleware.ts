import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import HttpException from "src/utils/http.exception";

export const authCheck = (
  req: Request & { uid: string },
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] as string;
    const secretKey = process.env.SECRETKEY as string;
    const payload = jwt.verify(token, secretKey) as {
      uid: string;
    };

    req.uid = payload.uid;

    next();
  } catch (error: any) {
    throw new HttpException(401, "Unauthorized ");
  }
};

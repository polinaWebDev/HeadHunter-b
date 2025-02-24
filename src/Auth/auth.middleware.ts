import { Request, NextFunction, Response } from 'express';
import { customReq } from '../types/CustomReq';

export function authMiddleware(req: customReq, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (token) {
    req.token = token;
  } else {
    req.token = null;
  }

  next();
}
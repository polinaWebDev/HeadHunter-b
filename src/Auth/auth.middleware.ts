import { Request, NextFunction, Response } from 'express';
import { customReq } from '../types/CustomReq';

export function authMiddleware(req: customReq, res: Response, next: NextFunction) {
  console.log('Auth middleware is called!');
  const token = req.cookies?.accessToken;

  if (token) {
    req.token = token;
  } else {
    req.token = null;
  }

  console.log('AuthMiddleware. Token:', req.token);

  next();
}
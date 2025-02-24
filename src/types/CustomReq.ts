import { User } from '../User/user.entity';
import { RefreshToken } from '../Auth/token/refresh-token.entity';
import { Request } from 'express';

export interface customReq extends Request {
  user: User;
  token: RefreshToken | null;
}
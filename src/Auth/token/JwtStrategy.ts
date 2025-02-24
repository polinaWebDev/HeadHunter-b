import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from "express";
import { customReq } from '../../types/CustomReq';

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {

    const secret = configService.get('JWT_ACCESS_SECRET');

    console.log('🔑 JWT_ACCESS_SECRET при верификации:', secret);

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.accessToken;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ['HS256']
    });
  }

  async validate(payload: JwtPayload) {
    console.log("🔥 JWT Strategy triggered with payload:", payload);
    if (!payload) {
      throw new UnauthorizedException("Invalid token");
    }
    return { id: payload.sub, email: payload.email };
  }
}
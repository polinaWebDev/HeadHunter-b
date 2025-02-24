import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { customReq } from '../../types/CustomReq';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    console.log("JwtAuthGuard.canActivate is called!");

    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        const refreshToken = request.cookies?.refreshToken;

        if (!refreshToken) {
          throw new UnauthorizedException("Refresh token is missing");
        }

        try {
          const newTokens = await this.authService.refreshTokens(refreshToken, response);
          console.log("Новые токены", newTokens)
          response.cookie('accessToken', newTokens.accessToken, { httpOnly: true });
          response.cookie('refreshToken', newTokens.refreshToken, { httpOnly: true });
          console.log("New tokens generated and sent.");
          return true;
        } catch (error) {
          throw new UnauthorizedException("Invalid or expired refresh token");
        }
      }
      throw error;
    }
  }



  getRequest(context: ExecutionContext): Request {
    const req = context.switchToHttp().getRequest<Request>();


    if (!req.cookies?.accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }


    return req;
  }
}
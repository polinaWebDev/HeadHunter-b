import {ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../User/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { compare } from 'bcryptjs';
import * as bcrypt from 'bcrypt';
import { User } from '../User/user.entity';
import { RefreshTokenRepository } from './token/refresh-token.repository';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepo: RefreshTokenRepository,
    private readonly configService: ConfigService
  ) {}
  
  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('errrrrror');

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException("Invalid credentials");
    
    const { accessToken } = await this.generateTokens(user);

    const decodedToken = this.decodeToken(accessToken);
    console.log('Decoded Token after login:', decodedToken);

    return user;
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException("User already exists");

    registerDto.password = await bcrypt.hash(password, 10);
    const user = await this.userService.createUser(registerDto);

    const { accessToken, refreshToken } = await this.login(user);

    return { user, accessToken, refreshToken };
  }

  async login(user: User) {
    return this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    console.log("JWT_ACCESS_SECRET:", this.configService.get("JWT_ACCESS_SECRET"));
    console.log("JWT_ACCESS_EXPIRES:", this.configService.get("JWT_ACCESS_EXPIRES"));

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get("JWT_ACCESS_EXPIRES"),
      algorithm: 'HS256',
    });


    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES"),
    });

    await this.refreshTokenRepo.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }


  async refreshTokens(refreshToken: string, res: Response) {
    console.log("sssss")
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });

      const isValid = await this.refreshTokenRepo.validateRefreshToken(payload.sub, refreshToken);
      if (!isValid) throw new ForbiddenException("Invalid refresh token");

      const user = await this.userService.findById(payload.sub);
      if (!user) throw new UnauthorizedException("User not found");

      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user);

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }

  async logout(userId: number, res: Response) {
    await this.refreshTokenRepo.deleteRefreshToken(userId);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out" });
  }

  public verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  public decodeToken(token: string): any {
    const decoded = this.jwtService.decode(token);
    console.log('Decoded token:', decoded);
    return decoded;
  }

}
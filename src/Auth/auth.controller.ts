import {
  Body,
  Controller, Get,
  Post, Req,
  Res, UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponse, RegisterResponse, UserResponseDto } from './auth.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDto } from './dto/register.dto';
import { multerConfig } from '../multer.config';
import { customReq } from '../types/CustomReq';
import { UserService } from '../User/user.service';
import { ConfigService } from '@nestjs/config';

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService, private readonly configService: ConfigService) {}

  @ApiOkResponse({ type: UserResponseDto, description: 'Получение пользователя' })
  @Get('me')
  async getMe(@Req() req: customReq, @Res() res: Response) {

    return res.json({
      token: req.token,
    });
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar_url', multerConfig))
  @ApiCreatedResponse({ type: RegisterResponse, description: 'Successful registration' })
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() avatar_url: Express.Multer.File,
    @Res({ passthrough: true }) res: Response
  ): Promise<RegisterResponse> {
    console.log('Request body:', registerDto);
    console.log('Avatar file:', avatar_url);

    if (avatar_url) {
      registerDto.avatar_url = avatar_url.path;
    }

    const { user, accessToken, refreshToken } = await this.authService.register(registerDto);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: this.configService.get("JWT_ACCESS_EXPIRES"),
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: this.configService.get("JWT_REFRESH_EXPIRES"),
      sameSite: "lax",
    });

    return { token: accessToken, user };
  }

  @ApiCreatedResponse({ type: LoginResponse, description: "Successful login" })
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto);
    const { accessToken, refreshToken } = await this.authService.generateTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: this.configService.get("JWT_ACCESS_EXPIRES") * 1000,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: this.configService.get("JWT_REFRESH_EXPIRES") * 1000,
      sameSite: "lax",
    });

    return res.json({ user, token: accessToken, refreshToken });
  }


  @Post('logout')
  @ApiCreatedResponse({ description: 'Successful logout' })
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('Logout request:', req.cookies);
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      console.log(this.authService)
      const payload = await this.authService.verifyToken(refreshToken);
      await this.authService.logout(payload.sub, res);

      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }


  @ApiCreatedResponse({ type: LoginResponse, description: "Successful token refresh" })
  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException("No refresh token found");

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(refreshToken, res);

    return res.json({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    });
  }


}
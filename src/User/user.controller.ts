import { UserService } from './user.service';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { Controller, Get, HttpCode, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { customReq } from '../types/CustomReq';
import { Request } from 'express';
import { JwtAuthGuard } from '../Auth/token/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserDto, description: "Получение профиля пользователя" })
  @ApiUnauthorizedResponse({ description: "Пользователь не авторизован" })
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: customReq): Promise<UserDto> {
    console.log("req.user-------------------------------:", req.user);
    const user = req.user ? await this.userService.findById(req.user.id) : null;
    if (!user) throw new UnauthorizedException("User not found");
    return user as UserDto;
  }
}
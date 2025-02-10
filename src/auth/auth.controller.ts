import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {ApiTags, ApiBody, ApiCreatedResponse} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {UsersService} from "../users/users.service";
import {CreateUserDTO} from "../users/dto/create-user.dto";
import {multerConfig} from "../multer.config";
import {JwtService} from "@nestjs/jwt";
import {LoginResponse, RegisterResponse} from "./auth.types";
import {LoginDto} from "../users/dto/login-user.dto";
import {AuthService} from "./auth.service";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('avatar', multerConfig))
    @ApiCreatedResponse({ type: RegisterResponse, description: 'Successful registration' })
    async register(
        @Body() createUserDto: CreateUserDTO,
        @UploadedFile() avatar: Express.Multer.File
    ): Promise<RegisterResponse> {
        console.log('Request body:', createUserDto);
        console.log('Avatar file:', avatar);

        if (avatar) {
            createUserDto.avatar_url = avatar.path;
        }

        return this.authService.register(createUserDto);
    }

    @Post('login')
    @ApiCreatedResponse({ type: LoginResponse, description: 'Successful login' })
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        const { token, user_id } = await this.authService.login(loginDto);
        return {
            token, user_id
        };
    }


}
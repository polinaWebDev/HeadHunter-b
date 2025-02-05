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
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @UseInterceptors(FileInterceptor('avatar', multerConfig)) // Используем конфиг multer
    @ApiCreatedResponse({ type: RegisterResponse, description: 'Successful registration' })
    async register(
        @Body() createUserDto: CreateUserDTO,
        @UploadedFile() avatar: Express.Multer.File
    ) {

        console.log('Request body:', createUserDto);
        console.log('Avatar file:', avatar);
        // Деструктурируем данные из DTO
        const { email, password, firstName, lastName, profileType } = createUserDto;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Если файл был загружен, сохраняем его путь
        if (avatar) {
            createUserDto.avatar_url = avatar.path; // Сохраняем путь к файлу в avatar_url
        }

        // Создаем пользователя через сервис
        const user = await this.usersService.createUser(
            email,
            hashedPassword,
            firstName,
            lastName,
            profileType,
            createUserDto.avatar_url // Передаем путь к аватарке
        );

        console.log('Created user:', user);
        // Создаем JWT токен для нового пользователя
        const token = this.jwtService.sign({ id: user.id, email: user.email });

        // Возвращаем ответ с данными о пользователе и токене
        return {
            message: 'User registered successfully',
            user,
            token,
        };
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
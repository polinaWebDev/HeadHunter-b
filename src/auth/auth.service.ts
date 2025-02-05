import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login-user.dto';
import {LoginResponse, RegisterResponse} from "./auth.types";
import {User} from "../users/user.entity";
import {ApiProperty} from "@nestjs/swagger";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    @ApiProperty()
    async register(createUserDto: CreateUserDTO): Promise<RegisterResponse> {
        const { email, password, firstName, lastName, avatar_url, profileType } = createUserDto;

        // Проверка на существующего пользователя
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new Error('Пользователь уже существует');
        }

        console.log('Creating user with data:', { email, firstName, lastName, profileType, avatar_url });

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const user = await this.usersService.createUser(
            email,
            hashedPassword,
            firstName,
            lastName,
            profileType,
            avatar_url
        );

        // Возвращаем объект с ответом на регистрацию
        return {
            token: this.jwtService.sign({ id: user.id, email: user.email }),
            user: {
                id: user.id,
                email: user.email,
                password: hashedPassword,
                avatar_url: user.avatar_url,
                firstName: user.firstName,
                lastName: user.lastName,
                profileType: user.profileType
            },
        };
    }

    @ApiProperty()
    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

        // Ищем пользователя в базе данных по email
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Неверный email или пароль');
        }

        // Сравниваем пароли
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный email или пароль');
        }
        console.log(user);
        // Создаем токен для пользователя
        const token = this.jwtService.sign({ id: user.id, email: user.email });

        // Возвращаем токен
        return {
            token: token,
            user_id: user.id,
        };
    }
}
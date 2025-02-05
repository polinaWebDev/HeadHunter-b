import {IsEmail, IsEnum, IsNotEmpty, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {ProfileType} from "../../types/profile_type";

export class CreateUserDTO {
    @ApiProperty({ description: 'Email пользователя' })
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @ApiProperty({ description: 'Пароль пользователя', minLength: 3 })
    @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
    @MinLength(3, { message: 'Пароль должен содержать минимум 3 символа' })
    password: string;

    @ApiProperty({ description: 'Имя пользователя' })
    @IsNotEmpty({ message: 'Имя обязательно' })
    firstName: string;

    @ApiProperty({ description: 'Фамилия пользователя' })
    @IsNotEmpty({ message: 'Фамилия обязательна' })
    lastName: string;

    @ApiProperty({ description: 'Аватарка пользователя', required: false  })
    avatar_url?: string;

    @ApiProperty({ description: 'Тип профиля', enum: ProfileType })
    @IsEnum(ProfileType, { message: 'Тип профиля должен быть "employer" или "job_seeker"' })
    profileType: ProfileType;
}
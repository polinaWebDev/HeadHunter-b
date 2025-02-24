import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ProfileType } from '../../types/ProfileType';

export class RegisterDto {
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

  @ApiProperty({ description: 'Тип профиля', enum: ProfileType })
  @IsEnum(ProfileType, { message: 'Тип профиля должен быть "employer" или "job_seeker"' })
  profile_type: ProfileType;

  @ApiProperty({
    description: 'Аватарка пользователя (файл)',
    type: 'string',
    required: false
  })
  @IsOptional()
  avatar_url?: string;
}
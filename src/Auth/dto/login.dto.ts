import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({ description: 'Пароль пользователя', minLength: 3 })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(3, { message: 'Пароль должен содержать минимум 3 символа' })
  password: string;
}
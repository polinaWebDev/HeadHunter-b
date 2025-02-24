import { UserDto } from '../User/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../User/user.entity';

export class LoginResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'User data returned after successful registration',
    example: {
      id: 1,
      email: 'user@example.com',
      avatar_url: 'https://example.com/avatar.jpg',
    },
  })
  user: UserDto
}

export class RegisterResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'User returned after successful registration',
  })
  user: User;
}

export class UserResponseDto {
  @ApiProperty({ description: 'Токен доступа' })
  token: string;

  @ApiProperty({ description: 'ID пользователя из рефреш-токена' })
  userId: number;
}
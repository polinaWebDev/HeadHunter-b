import { ApiProperty } from '@nestjs/swagger';
import {User} from "../users/user.entity";

export class RegisterResponse {
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
    user: User
}


export class LoginResponse {
    @ApiProperty({
        description: 'JWT access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    token: string;

    @ApiProperty({
        description: 'User id returned after successful registration',
        example: 1,
    })
    user_id: number;
}
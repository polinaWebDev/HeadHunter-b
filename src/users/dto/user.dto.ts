import { ApiProperty } from "@nestjs/swagger";
import {ProfileType} from "../../types/profile_type";
import {IsEnum} from "class-validator";

export class UserDto {
    @ApiProperty({ example: 1, description: "ID пользователя" })
    id: number;

    @ApiProperty({ example: "john@example.com", description: "Email пользователя" })
    email: string;

    @ApiProperty({example: "John", description: "Имя пользователя"})
    firstName: string;

    @ApiProperty({example: "John", description: "Фамилия пользователя"})
    lastName: string;

    @ApiProperty({example: "123-123.png" , description: 'Аватарка пользователя', required: false})
    avatar_url?: string;

    @ApiProperty({example: "employer",description: 'Тип профиля', enum: ProfileType })
    @IsEnum(ProfileType, { message: 'Тип профиля должен быть "employer" или "job_seeker"' })
    profileType: ProfileType;

}
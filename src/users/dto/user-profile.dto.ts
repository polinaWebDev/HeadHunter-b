import { ApiProperty } from "@nestjs/swagger";
import {ProfileType} from "../../types/profile_type";
import {IsEnum} from "class-validator";

export class UserProfileDto {
    @ApiProperty({ example: 1, description: "ID пользователя" })
    id: number;

    @ApiProperty({ example: "john@example.com", description: "Email пользователя" })
    email: string;

    @ApiProperty({example: "John", description: "Имя пользователя"})
    firstName: string;

    @ApiProperty({example: "John", description: "Фамилия пользователя"})
    lastname: string;

    @ApiProperty({example: "123-123.png" , description: 'Аватарка пользователя'})
    avatar_url?: string;

    @ApiProperty({example: "employer",description: 'Тип профиля', enum: ProfileType })
    @IsEnum(ProfileType, { message: 'Тип профиля должен быть "employer" или "job_seeker"' })
    profileType: ProfileType;

}
import {Controller, Get, Param, Req, UnauthorizedException, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/JwtAuthGuard";
import {ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiTags} from "@nestjs/swagger";
import {User} from "./user.entity";
import {RequestWithUser} from "../types/RequestWithUser";
import {UserProfileDto} from "./dto/user-profile.dto";

@ApiTags("users")
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({ type: UserProfileDto, description: "Получение профиля пользователя" })
    @Get("profile")
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req: RequestWithUser): Promise<UserProfileDto> {
        if (!req.user) throw new UnauthorizedException("User not found");
        const user = await this.usersService.findById(req.user.id); // Получаем пользователя из базы
        if (!user) throw new UnauthorizedException("User not found");
        return {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
            lastname: user.lastName,
            profileType: user.profileType,
            avatar_url: user.avatar_url,
        };
    }
}

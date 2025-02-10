import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {RequestWithUser} from "../types/RequestWithUser";
import {ApiTags} from "@nestjs/swagger";

@ApiTags("JwtAuthGuard")
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const authHeader = request.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException('Отсутствует или некорректный токен')
        }

        const token = authHeader.split(' ')[1]

        try {
            console.log("JwtAuthGuard", token);
            const decoded = this.jwtService.verify(token);
            console.log("Расшифрованный токен", decoded);
            console.log("JWT_SECRET:", process.env.JWT_SECRET);
            request.user = decoded;
            return true;
        } catch (error) {
            console.error("Ошибка токена", error);
            throw new UnauthorizedException('Токен недействителен или истёк');
        }
    }
}


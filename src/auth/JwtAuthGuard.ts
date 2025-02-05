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
            const decoded = this.jwtService.verify(token);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Токен недействителен или истёк');
        }
    }
}
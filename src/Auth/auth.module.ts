import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './token/JwtStrategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../User/user.module';
import { JwtAuthGuard } from './token/jwt-auth.guard';
import { TokenModule } from './token/token.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    UserModule,
    TokenModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: configService.get("JWT_ACCESS_EXPIRES") },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard, AuthService]
})

export class AuthModule {}


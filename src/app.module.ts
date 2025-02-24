import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './User/user.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './Auth/token/JwtStrategy';
import { AuthModule } from './Auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { TokenModule } from './Auth/token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
    }),
    PassportModule.register({ defaultStrategy: "jwt" }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TokenModule,
    JwtModule
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}

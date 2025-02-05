import { Module } from '@nestjs/common';

import {DatabaseModule} from "./database/database.module";
import {AppController} from "./app.controller";
import {AuthModule} from "./auth/auth.module";
import {JwtAuthGuard} from "./auth/JwtAuthGuard";
import {APP_GUARD} from "@nestjs/core";

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
  ],
  controllers: [AppController],
})
export class AppModule {}
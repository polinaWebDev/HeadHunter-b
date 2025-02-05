import {Controller, Get, Redirect} from '@nestjs/common';
import {ApiProperty} from "@nestjs/swagger";

@Controller()
export class AppController {
    @ApiProperty()
    @Get()
    @Redirect('/auth/login', 302)
    getRoot() {}
}
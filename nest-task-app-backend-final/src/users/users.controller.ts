import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserDto } from './dto/user.dto.js';
import type { Request, Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('signup')
    async create(@Body() userDto: UserDto, @Res({ passthrough: true }) res: Response) {
   

        return await this.userService.createUser(userDto.name, userDto.password, res);
    }


    @Post('login')
    async login(@Body() userDto: UserDto, @Res({ passthrough: true }) res: Response) {
     
           
        
        return await this.userService.loginUser(userDto, res);

    }

    @Post('refresh')
    refreshToken(@Req() req: Request) {

        return this.userService.refreshToken(req);
    }


    @Get('profile')
    profile() {
        return "profile page"
    }

}

import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserDto } from './dto/user.dto.js';
import { UsersGuard } from './users.guard.js';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post('signup')
    create(@Body() userDto: UserDto, @Res({ passthrough: true }) res : any) {
        return this.userService.createUser(userDto.name, userDto.password, res);
    }

    @Post('login')
    login(@Body() userDto: UserDto,  @Res({ passthrough: true }) res : any) {
        return this.userService.loginUser(userDto, res)
    }

    @Post('refresh')
    refreshToken(@Res() res : any) {
        return this.userService.refreshToken(res);
    }


    @Get('profile')
    profile() {
        return "profile page"
    }

}

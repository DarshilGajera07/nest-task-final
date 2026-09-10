import { Injectable, Req, Request, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto.js';
import { UsersGuard } from './users.guard.js';



@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService: JwtService) { }

    async createUser(name: string, password: string, @Res() res : any): Promise<any> {
        const isUser = await this.userRepository.findOneBy({ name: name })
        console.log(isUser);
        

        if (isUser) {
            throw new Error('User already exists');
        }

        const saltOrRounds = 10;
        password = await bcrypt.hash(password, saltOrRounds);

        const user =  this.userRepository.create({ name, password });
        
        await  this.userRepository.save(user);
        const payload = { sub: user.id, name: user.name };
        

        let refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        
        let accessToken =  this.jwtService.sign(payload, {expiresIn: '30s'});
        
        return {
            access_token: accessToken
        };
    }


    

    async loginUser(userDto : UserDto, @Res() res : any): Promise<any> {
        const user = await this.userRepository.findOneBy({ name: userDto.name });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(userDto.password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        const payload = { sub: user.id, name: user.name };
        let accessToken = this.jwtService.sign(payload, {expiresIn: '30s'});

        let refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return {
            access_token: accessToken
        };
    }

    async refreshToken(@Request() req: any): Promise<any> {
        let token = req.headers.cookie;
        let refreshToken = token.split('=')[1];
        
         if (!refreshToken) {
            return { message: 'No refresh token' };
        }
        const payload = this.jwtService.verify(refreshToken);
        const newAccessToken = this.jwtService.sign(payload);
        return {
            access_token: newAccessToken
        };
    }

 
}
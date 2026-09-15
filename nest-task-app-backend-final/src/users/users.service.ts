import { Injectable, Req, Request, Res, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto.js';
import { Response } from 'express';
import { UserSession } from './entities/UserSession.entity.js';



@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService: JwtService, @InjectRepository(UserSession) private readonly userSessionRepository: Repository<UserSession>,) { }

    async createUser(name: string, password: string, res: Response): Promise<any> {
        const isUser = await this.userRepository.findOneBy({ name: name })
        console.log(isUser);


        if (isUser) {
            throw new Error('User already exists');
        }

        const saltOrRounds = 10;
        password = await bcrypt.hash(password, saltOrRounds);

        const user = this.userRepository.create({ name, password });


        await this.userRepository.save(user);
        const payload = { sub: user.id, name: user.name };


        let refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });


        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        let accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });


        return {
            access_token: accessToken
        };
    }




    async loginUser(userDto: UserDto, res: Response): Promise<any> {
        const user = await this.userRepository.findOneBy({ name: userDto.name });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(userDto.password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        const payload = { sub: user.id, name: user.name };
        let accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

        let refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        const usersession = this.userSessionRepository.create({
            userId: user.id,
            accessToken: accessToken,
            accessTokenExpires: "5s",
            refreshAccessToken: refreshToken,
            refreshAccessTokenExpires: "10s"
        });

        await this.userSessionRepository.save(usersession)


        return {
            access_token: accessToken
        };
    }


    async logout(req: any, res: Response): Promise<any> {
        const user = req['user'];

        if (user && user.sub) {
            await this.userSessionRepository.delete({ userId: user.sub });
        }

        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Logout successful" });
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
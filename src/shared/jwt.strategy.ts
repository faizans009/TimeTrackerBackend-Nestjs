/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/user/user.service';
import 'dotenv/config';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        const user = await this.userService.findOneByField({
            _id: new ObjectId(id),
        });
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

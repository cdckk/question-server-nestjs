import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    // 依赖注入
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string) {
        const user = await this.userService.findOne(username, password);

        if (!user) {
            throw new UnauthorizedException('用户名密码错误')
        }

        const { password: p, ...userInfo } = user.toObject()

        // return userinfo // 不返回 password 字段
        return {
            token: await this.jwtService.sign(userInfo),
        }
    }
}

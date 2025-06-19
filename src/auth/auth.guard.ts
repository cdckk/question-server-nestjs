import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extrackTokenFromHeader(request);
    if (!token) {
        throw new UnauthorizedException('未登录');
    }
    try {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
        });
        request['user'] = payload;
    } catch {
        throw new UnauthorizedException('token 无效');
    }
    return true
  }

  private extrackTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log('登录...', type, token, request.headers.authorization)
    return type === 'Bearer' ? token : undefined
  }
}
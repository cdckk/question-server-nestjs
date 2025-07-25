import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);
    if (isPublic) {
        return true
    }

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
    return type === 'Bearer' ? token : undefined
  }
}
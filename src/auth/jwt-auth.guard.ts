import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization || request.headers?.Authorization;

    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header with Bearer token is required');
    }

    const token = authHeader.substring(7).trim();

    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User account no longer exists');
      }

      const { password, ...safeUser } = user;
      request.user = safeUser;
      return true;
    } catch {
      throw new UnauthorizedException('Token is invalid or has expired');
    }
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext['token'];

    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const userId = decoded['id'];
        const user = await this.usersService.findUserById(userId);
        // const cookies = gqlContext.req.cookies;
        // const refreshToken = cookies?.refreshToken;
        // const a = await this.usersService.getUserIfRefreshTokenMatches(user, refreshToken);

        if (user) {
          gqlContext['user'] = user;
          return true;
        }
      }
    }
    // 일시적으로 다 허용
    return true;
  }
}

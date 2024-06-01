import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `$(process.env.JWT_SECRET)`,
    });
  }
  async validate(payload: any): Promise<any> {
    const user = await this.userService.findOne(payload.mobile);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    if (user.passwordChangedAt) {
      const passwordChangingTime = user.passwordChangedAt;
      if (payload.iat < passwordChangingTime) {
        throw new UnauthorizedException('Invalid token ');
      }
    }
    return user;
  }
}

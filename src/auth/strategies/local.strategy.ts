import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'mobile',
      passwordField: 'password',
    });
  }

  async validate(mobile: string, password: string) {
    const user = await this.authService.validateUser(mobile, password);
    return user;
  }
}

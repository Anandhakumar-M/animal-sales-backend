import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppLogger } from 'src/common/helpers/app.logger';
import { ErrorFilter } from 'src/common/helpers/errors';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@UseFilters(new ErrorFilter(new AppLogger()))
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Post('mobileVerification')
  async mobileVerification(@Body() body) {
    const mobile = body.mobile;
    const OTP = body.OTP;
    return await this.authService.mobileVerification(mobile, OTP);
  }

  @Post('emailVerification')
  async emailVerification(@Body() body) {
    const email = body.email;
    const otp = body.otp;
    console.log(email);

    return await this.authService.emailVerification(email, otp);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() body) {
    console.log(body);

    console.log(req);

    return await this.authService.login(req.user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('mobile') mobile: string): Promise<string> {
    const user = await this.authService.forgotPassword(mobile);
    return user;
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Body('email') email: string,
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    const user = await this.authService.resetPassword(
      email,
      token,
      newPassword,
    );
    return user;
  }

  @Post('ChangedPassword/:id')
  @UseGuards(AuthGuard('jwt'))
  ChangedPassword(
    @Param('id') id: string,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.ChangedPassword(id, oldPassword, newPassword);
  }

  @Post('ChangedMobile/:id')
  @UseGuards(AuthGuard('jwt'))
  ChangedMobile(
    @Param('id') id: string,
    @Body('oldMobile') oldMobile: string,
    @Body('newMobile') newMobile: string,
    @Body('password') password: string,
  ) {
    return this.authService.ChangedMobileNumber(
      id,
      oldMobile,
      newMobile,
      password,
    );
  }
}

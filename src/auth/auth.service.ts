import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/schemas/user.schema';
import { UsersService } from 'src/user/user.service';
import { v4 as uuid4 } from 'uuid';
import { EmailService } from './services/mail/email.service';
import { MobileService } from './services/mobile/mobile.service';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mobileService: MobileService,
    private readonly emailService: EmailService,
  ) {}

  async signup(createUserDto): Promise<any> {
    if (createUserDto.mobile != null && createUserDto.email != null) {
      const OTP = Math.floor(1000 + Math.random() * 9000).toString();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(otp);
      console.log(OTP);

      await this.mobileService.sendVerificationCode(
        createUserDto.mobile,
        OTP,
        'complete your verification process',
      );
      await this.emailService.sendResetPasswordEmail(
        createUserDto.email,
        otp,
        'Verify your Email ',
        'Verify your email address \nYou need to verify your email address to continue to using your application',
      );
      const user = await this.usersService.create(createUserDto, OTP, otp);
      return user;
    } else {
      const otp = null;
      const OTP = Math.floor(1000 + Math.random() * 9000).toString();
      await this.mobileService.sendVerificationCode(
        createUserDto.mobile,
        OTP,
        'complete your verification process',
      );
      const user = await this.usersService.create(createUserDto, OTP, otp);
      return user;
    }
  }

  async sendSMS(mobile: string) {
    const user = await this.usersService.findOne(mobile);
    if (user.mobileVerification == true) {
      throw new Error('This number is already verified');
    }
    const OTP = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(OTP);

    await this.mobileService.sendVerificationCode(
      mobile,
      OTP,
      'complete your verification process',
    );
  }

  async sendEmail(email: string) {
    const user = await this.usersService.findEmail(email);
    if (user.emailVerification == true) {
      throw new Error('This number is already verified');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    await this.emailService.sendResetPasswordEmail(
      email,
      otp,
      'Verify your Email ',
      'Verify your email address \nYou need to verify your email address to continue to using your application',
    );
  }

  async mobileVerification(mobile: string, OTP: string) {
    const user = await this.usersService.findOne(mobile);
    if (user.mobileVerificationToken == OTP) {
      user.mobileVerification = true;
      user.mobileVerificationToken = null;
      await user.save();
      return 'Verification Complect';
    }
    throw new NotFoundException('Incorrect OTP');
  }

  async emailVerification(email: string, otp: string) {
    console.log(email);

    const user = await this.usersService.findEmail(email);
    console.log(user);
    if (user.emailVerificationToken == otp) {
      user.emailVerification = true;
      user.emailVerificationToken = null;
      await user.save();
      return 'Verification Complect';
    }
    throw new NotFoundException('Incorrect OTP');
  }

  async validateUser(mobile: string, password: string) {
    const isMobile = /^[6-9]\d{9}$/.test(mobile);
    if (isMobile) {
      const user = await this.usersService.findOne(mobile);
      console.log(user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new NotFoundException('Invalid password');
      }
      if (user.mobileVerification != true) {
        throw new NotFoundException(
          'Mobile number is not verify places complect the verify and login again',
        );
      }
      return user;
    } else {
      const user = await this.usersService.findEmail(mobile);
      console.log(user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isValid = await compare(password, user.password);
      if (!isValid) {
        throw new NotFoundException('Invalid password');
      }
      if (user.mobileVerification != true) {
        throw new NotFoundException(
          'Mobile number is not verify places complect the verify and login again',
        );
      }
      if (user.email != null) {
        if (user.emailVerification != true) {
          throw new NotFoundException(
            'Email is not verify to use mobile number for login',
          );
        }
      }
      return user;
    }
  }

  async login(user: User): Promise<any> {
    const payload = { id: user._id, mobile: user.mobile, email: user.email };
    return {
      userId: user._id,
      Token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(mobile: string): Promise<string> {
    const user = await this.usersService.findOne(mobile);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuid4();
    user.passwordResetToken = resetToken;
    await user.save();

    const jwtToken = jwt.sign({ resetToken }, this.JWT_SECRET, {
      expiresIn: '300s',
    });

    // await this.emailService.sendResetPasswordEmail(user.email, jwtToken);
    console.log((user.email, jwtToken));

    return 'Reset password link sent';
  }
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<string> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const decodedToken: any = jwt.verify(token, this.JWT_SECRET);

      if (decodedToken.resetToken !== user.passwordResetToken) {
        throw new UnauthorizedException('Invalid token');
      }
      user.password = newPassword;
      user.passwordResetToken = null;
      user.passwordChangedAt = Date.now();
      await user.save();

      return 'Password reset successful';
    } catch (error) {
      throw new UnauthorizedException('Invalid token +');
    }
  }
  async ChangedPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<string> {
    const user = await this.usersService.findId(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await compare(oldPassword, user.password);
    if (!isValid) {
      throw new NotFoundException('Invalid password');
    }

    user.password = newPassword;

    user.passwordChangedAt = Date.now();
    await user.save();

    return 'Password changed successful';
  }
  async ChangedMobileNumber(
    id: string,
    oldMobile: string,
    newMobile: string,
    Password: string,
  ): Promise<string> {
    const user = await this.usersService.findUser(id, oldMobile);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await compare(Password, user.password);
    if (!isValid) {
      throw new NotFoundException('Invalid password');
    }
    const checkNewNumber = await this.usersService.findOne(newMobile);

    if (checkNewNumber) {
      throw new NotFoundException('This MobileNumber is already use');
    }
    user.mobile = newMobile;

    user.mobileChangedAt = Date.now();
    await user.save();

    return 'mobile changed successful';
  }
}

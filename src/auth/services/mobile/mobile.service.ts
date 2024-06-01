import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class MobileService {
  private readonly client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendVerificationCode(
    phoneNumber: string,
    OTP: string,
    type: String,
  ): Promise<void> {
    try {
      await this.client.messages.create({
        body: `Your One-Time-Password is: [${OTP}]. Please use this code to ${type}. Do not share this code with anyone for security reasons`,
        to: `+91${phoneNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send verification code');
    }
  }
}

import * as nodemailer from 'nodemailer';

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendResetPasswordEmail(email: string, OTP: string,subject:String,type:string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject:subject,
      text: `${type}. Your One-Time Password (OTP) is:\n ${OTP} \n \n Do not share this code with anyone for security reasons`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private zeptoClient: SendMailClient | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const provider = process.env.MAIL_PROVIDER || 'zeptoapi';

    if (provider === 'smtp') {
      // 🔧 SMTP setup (like Gmail or Zepto SMTP)
      this.transporter = nodemailer.createTransport({
        host: process.env.ZEPTO_HOST,
        port: Number(process.env.ZEPTO_PORT),
        secure: false,
        auth: {
          user: process.env.ZEPTO_USER,
          pass: process.env.ZEPTO_PASS,
        },
      });
      this.logger.log('📨 Using SMTP Mail Provider');
    } else if (provider === 'zeptoapi') {
      // ⚡ ZeptoMail API setup
      const url = process.env.ZEPTO_API_URL || 'https://api.zeptomail.com/';
      const token = process.env.ZEPTO_API_TOKEN;

      // 👇 Log token safely (for debugging)
      this.logger.log(
        `🔑 ZeptoMail token being used: ${
          token ? token.slice(0, 30) + '...' : 'undefined'
        }`,
      );

      if (!token) {
        this.logger.error('❌ No ZeptoMail API token found in .env!');
      }

      this.zeptoClient = new SendMailClient({ url, token });
      this.logger.log('⚡ Using ZeptoMail API Provider');
    } else {
      throw new Error('Invalid MAIL_PROVIDER in .env file');
    }
  }

  // 🎉 Send Welcome Email
  async sendWelcomeEmail(email: string, firstName: string) {
    const htmlBody = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #111827;">Welcome to Example, ${firstName} 👋</h2>
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        We’re delighted to have you join our community. Your account has been successfully created, 
        and you’re all set to explore everything our platform has to offer.
      </p>
      <p style="color: #374151; font-size: 15px;">
        Log in to your dashboard to start exploring and managing your experience effortlessly.
      </p>
      <a href="https://yourappdomain.com/login" 
         style="display: inline-block; margin-top: 20px; background-color: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
         Go to Dashboard
      </a>
      <br/><br/>
      <p style="color: #6b7280; font-size: 14px;">If you have any questions, contact our support team anytime at <a href="mailto:support@exquisappfactory.com">support@exquisappfactory.com</a>.</p>
      <br/>
      <p style="color: #111827;">Best regards,<br/><strong>The Example Team</strong></p>
    </div>
  </div>
`;

    try {
      if (this.zeptoClient) {
        await this.zeptoClient.sendMail({
          from: { address: this.getFromAddress(), name: 'Example Team' },
          to: [{ email_address: { address: email, name: firstName } }],
          subject: '🎉 Welcome to Our Platform!',
          htmlbody: htmlBody,
        });
        this.logger.log(`✅ Welcome email sent to ${email} via ZeptoMail API`);
      } else if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.ZEPTO_FROM,
          to: email,
          subject: '🎉 Welcome to Our Platform!',
          html: htmlBody,
        });
        this.logger.log(`✅ Welcome email sent to ${email} via SMTP`);
      }
    } catch (error) {
      this.handleMailError(error, email);
    }
  }

  // 🔐 Send Password Reset OTP
  async sendPasswordResetOTP(email: string, otp: string) {
    const htmlBody = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
      <h2 style="color: #111827;">Password Reset Request</h2>
      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        We received a request to reset your password. Use the One-Time Passcode (OTP) below to complete the process.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 4px;">${otp}</h1>
        <p style="color: #6b7280; font-size: 14px;">This OTP will expire in <strong>10 minutes</strong>.</p>
      </div>
      <p style="color: #374151; font-size: 15px;">
        If you did not request a password reset, please ignore this email or contact our support team immediately.
      </p>
      <br/>
      <p style="color: #111827;">Stay secure,<br/><strong>The Example Team</strong></p>
      <p style="color: #6b7280; font-size: 13px;">Need help? Reach us at <a href="mailto:support@exquisappfactory.com">support@exquisappfactory.com</a></p>
    </div>
  </div>
`;

    try {
      if (this.zeptoClient) {
        await this.zeptoClient.sendMail({
          from: { address: this.getFromAddress(), name: 'Example Team' },
          to: [{ email_address: { address: email } }],
          subject: '🔐 Password Reset OTP',
          htmlbody: htmlBody,
        });
        this.logger.log(`✅ OTP email sent to ${email} via ZeptoMail API`);
      } else if (this.transporter) {
        await this.transporter.sendMail({
          from: process.env.ZEPTO_FROM,
          to: email,
          subject: '🔐 Password Reset OTP',
          html: htmlBody,
        });
        this.logger.log(`✅ OTP email sent to ${email} via SMTP`);
      }
    } catch (error) {
      this.handleMailError(error, email);
    }
  }

  // 🧩 Helper to parse FROM email correctly
  private getFromAddress(): string {
    const from = process.env.ZEPTO_FROM;
    const match = from?.match(/<(.*?)>/);
    return match ? match[1] : from || 'auth@example.com';
  }

  // 🧠 Centralized error handler
  private handleMailError(error: any, email: string) {
    if (error?.error?.details) {
      this.logger.error(
        `❌ ZeptoMail API Error while sending to ${email}: ${JSON.stringify(
          error.error,
          null,
          2,
        )}`,
      );
    } else if (error?.message) {
      this.logger.error(
        `❌ ZeptoMail API Unknown Error while sending to ${email}: ${error.message}`,
      );
    } else {
      this.logger.error(
        `❌ ZeptoMail API Unknown Error while sending to ${email}: ${JSON.stringify(
          error,
        )}`,
      );
    }
  }
}

// import { Injectable, Logger } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class MailService {
//   private transporter: nodemailer.Transporter;
//   private readonly logger = new Logger(MailService.name);

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.ZEPTO_HOST,
//       port: Number(process.env.ZEPTO_PORT),
//       secure: false,
//       auth: {
//         user: process.env.ZEPTO_USER,
//         pass: process.env.ZEPTO_PASS,
//       },
//     });
//   }

//   async sendWelcomeEmail(email: string, firstName: string) {
//     const mailOptions = {
//       from: process.env.ZEPTO_FROM,
//       to: email,
//       subject: '🎉 Welcome to Our Platform!',
//       html: `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>Welcome, ${firstName}!</h2>
//           <p>We're thrilled to have you here.</p>
//           <p>Get started by logging in to your account.</p>
//           <br/>
//           <p>Cheers,<br/>The Example Team 🚀</p>
//         </div>
//       `,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`✅ Welcome email sent to ${email}`);
//     } catch (error) {
//       this.logger.error(`❌ Failed to send welcome email: ${error.message}`);
//     }
//   }

//   async sendPasswordResetOTP(email: string, otp: string) {
//     const mailOptions = {
//       from: process.env.ZEPTO_FROM,
//       to: email,
//       subject: '🔐 Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>Password Reset Request</h2>
//           <p>Your OTP is:</p>
//           <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
//           <p>This OTP expires in <strong>10 minutes</strong>.</p>
//           <br/>
//           <p>If you didn’t request this, please ignore the email.</p>
//         </div>
//       `,
//     };

//     try {
//       await this.transporter.sendMail(mailOptions);
//       this.logger.log(`✅ OTP email sent to ${email}`);
//     } catch (error) {
//       this.logger.error(`❌ Failed to send OTP email: ${error.message}`);
//     }
//   }
// }



import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private zeptoClient: SendMailClient | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const provider = process.env.MAIL_PROVIDER || 'zeptoapi'; // Default to ZeptoMail API

    if (provider === 'smtp') {
      // 🔧 SMTP (e.g. Gmail) setup
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
      // 🔧 ZeptoMail API setup
      const url = 'api.zeptomail.com/';
      const token = process.env.ZEPTO_API_KEY;
      this.zeptoClient = new SendMailClient({ url, token });
      this.logger.log('⚡ Using ZeptoMail API Provider');
    } else {
      throw new Error('Invalid MAIL_PROVIDER in .env file');
    }
  }

  // 🎉 Send Welcome Email
  async sendWelcomeEmail(email: string, firstName: string) {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome, ${firstName}!</h2>
        <p>We’re thrilled to have you onboard.</p>
        <p>Get started by logging in to your account!</p>
        <br/>
        <p>Cheers,<br/>The Example Team 🚀</p>
      </div>
    `;

    if (this.zeptoClient) {
      // ZeptoMail API version
      try {
        await this.zeptoClient.sendMail({
          from: { address: process.env.ZEPTO_FROM, name: 'Example Team' },
          to: [{ email_address: { address: email, name: firstName } }],
          subject: '🎉 Welcome to Our Platform!',
          htmlbody: htmlBody,
        });
        this.logger.log(`✅ Welcome email sent to ${email} via ZeptoMail API`);
      } catch (error) {
        this.logger.error(`❌ ZeptoMail API Error: ${error.message}`);
      }
    } else if (this.transporter) {
      // SMTP version
      try {
        await this.transporter.sendMail({
          from: process.env.ZEPTO_FROM,
          to: email,
          subject: '🎉 Welcome to Our Platform!',
          html: htmlBody,
        });
        this.logger.log(`✅ Welcome email sent to ${email} via SMTP`);
      } catch (error) {
        this.logger.error(`❌ SMTP Error: ${error.message}`);
      }
    }
  }

  // 🔐 Send Password Reset OTP
  async sendPasswordResetOTP(email: string, otp: string) {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <br/>
        <p>If you didn’t request this, please ignore this email.</p>
        <p>Stay secure,<br/>The Example Team 🔒</p>
      </div>
    `;

    if (this.zeptoClient) {
      try {
        await this.zeptoClient.sendMail({
          from: { address: process.env.ZEPTO_FROM, name: 'Example Team' },
          to: [{ email_address: { address: email } }],
          subject: '🔐 Password Reset OTP',
          htmlbody: htmlBody,
        });
        this.logger.log(`✅ OTP email sent to ${email} via ZeptoMail API`);
      } catch (error) {
        this.logger.error(`❌ ZeptoMail API Error: ${error.message}`);
      }
    } else if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: process.env.ZEPTO_FROM,
          to: email,
          subject: '🔐 Password Reset OTP',
          html: htmlBody,
        });
        this.logger.log(`✅ OTP email sent to ${email} via SMTP`);
      } catch (error) {
        this.logger.error(`❌ SMTP Error: ${error.message}`);
      }
    }
  }
}

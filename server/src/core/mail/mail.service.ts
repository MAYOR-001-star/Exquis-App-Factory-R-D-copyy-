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

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  // 📨 Send Welcome Email
  async sendWelcomeEmail(email: string, firstName: string) {
    try {
      await axios.post(
        'https://api.zeptomail.com/v1.1/email',
        {
          from: { address: process.env.ZEPTO_FROM },
          to: [{ email_address: { address: email } }],
          subject: '🎉 Welcome to Our Platform!',
          htmlbody: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Welcome, ${firstName}!</h2>
              <p>We’re thrilled to have you onboard.</p>
              <p>Get started by logging into your account and exploring our features.</p>
              <br/>
              <p>Cheers,<br/>The Example Team 🚀</p>
            </div>
          `,
        },
        {
          headers: {
            Authorization: `Zoho-enczapikey ${process.env.ZEPTO_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email: ${error.message}`);
    }
  }

  // 🔐 Send Password Reset OTP
  async sendPasswordResetOTP(email: string, otp: string) {
    try {
      await axios.post(
        'https://api.zeptomail.com/v1.1/email',
        {
          from: { address: process.env.ZEPTO_FROM },
          to: [{ email_address: { address: email } }],
          subject: '🔐 Password Reset OTP',
          htmlbody: `
            <div style="font-family: Arial, sans-serif;">
              <h2>Password Reset Request</h2>
              <p>Your OTP code is:</p>
              <h1 style="color: #4CAF50; font-size: 32px;">${otp}</h1>
              <p>This OTP will expire in <strong>10 minutes</strong>.</p>
              <p>If you didn’t request a password reset, please ignore this email.</p>
              <br/>
              <p>Security first,<br/>The Example Team 🔒</p>
            </div>
          `,
        },
        {
          headers: {
            Authorization: `Zoho-enczapikey ${process.env.ZEPTO_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      this.logger.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send OTP email: ${error.message}`);
    }
  }
}

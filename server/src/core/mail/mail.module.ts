// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // make sure .env variables are loaded
    MailerModule.forRoot({
      transport: {
        host: process.env.ZEPTO_HOST,
        port: Number(process.env.ZEPTO_PORT),
        secure: false, // ZeptoMail uses TLS on 587 (so false)
        auth: {
          user: process.env.ZEPTO_USER,
          pass: process.env.ZEPTO_PASS,
        },
      },
      defaults: {
        from: process.env.ZEPTO_FROM, // e.g. "Example Team <auth@exquisappfactory.com>"
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}

import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Mail') // 👈 Shows up as "Mail" section in Swagger
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('test')
  @ApiOperation({ summary: 'Send a test welcome email' })
  @ApiResponse({
    status: 200,
    description: '✅ Test email sent successfully!',
    schema: {
      example: { message: '✅ Test email sent successfully!' },
    },
  })
  async sendTestEmail() {
    await this.mailService.sendWelcomeEmail(
      'mayorkunabdulazeez01@gmail.com', // 👈 your real email
      'Mayor',
    );
    return { message: '✅ Test email sent successfully!' };
  }
}

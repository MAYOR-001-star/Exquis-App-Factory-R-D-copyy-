import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // 🧩 Step 1: Initiate password reset
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    return this.authService.requestPasswordReset(email);
  }

  // 🔐 Step 2: Reset password with valid token
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!token || !newPassword)
      throw new BadRequestException('Token and new password are required');
    return this.authService.resetPassword(token, newPassword);
  }
}

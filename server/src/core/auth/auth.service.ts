import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { User } from './schema/userSchema';
import { MailService } from 'src/core/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  // =============================
  // REGISTER
  // =============================
  async register(registerUserDto: RegisterUserDto) {
    const { firstName, lastName, email, password, confirmPassword } =
      registerUserDto;

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await this.mailService.sendWelcomeEmail(user.email, user.firstName);

    return {
      message: 'Registration successful. A welcome email has been sent.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  // =============================
  // LOGIN
  // =============================
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  }

  // =============================
  // REQUEST PASSWORD RESET (STRICT OTP)
  // =============================
  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    // Generate new OTP and expire previous ones
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes validity

    // Overwrite any previous OTP to make it invalid
    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;

    await user.save();

    await this.mailService.sendPasswordResetOTP(user.email, otp);

    return { message: 'A new OTP has been sent to your email address.' };
  }

  // =============================
  // VERIFY OTP & RESET PASSWORD (STRICT)
  // =============================
  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    // Reject if OTP not found or expired
    if (!user.resetOtp || !user.resetOtpExpires) {
      throw new BadRequestException('No active OTP. Please request a new one.');
    }

    // Reject if OTP expired
    if (user.resetOtpExpires < new Date()) {
      // clear expired OTP to prevent reuse
      user.resetOtp = null;
      user.resetOtpExpires = null;
      await user.save();
      throw new BadRequestException('OTP has expired. Request a new one.');
    }

    // Reject if OTP doesn’t match the latest one
    if (user.resetOtp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    // OTP is valid → reset password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear OTP immediately after successful reset
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    return { message: 'Password successfully updated.' };
  }
}

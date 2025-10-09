import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, LoginUserDto } from './dto/auth.dto';
import { User } from './schema/userSchema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // =============================
  // REGISTER
  // =============================
  async register(registerUserDto: RegisterUserDto) {
    const { firstName, lastName, email, password } = registerUserDto;
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return {
      message: 'Registration successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
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
        role: user.role,
      },
    };
  }

  // =============================
  // REQUEST PASSWORD RESET
  // =============================
  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('User not found');

    // Generate short-lived token
    const token = this.jwtService.sign(
      { userId: user._id },
      {
        secret: process.env.JWT_RESET_SECRET || 'reset_secret_key',
        expiresIn: '15m',
      },
    );

    // In production, you'd send this token in an email
    // e.g., send via mailService
    // For now, we’ll just return it
    return {
      message: 'Password reset token generated',
      token,
    };
  }

  // =============================
  // RESET PASSWORD
  // =============================
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET || 'reset_secret_key',
      });

      const user = await this.userModel.findById(payload.userId);
      if (!user) throw new BadRequestException('User not found');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return { message: 'Password successfully updated' };
    } catch (err) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}

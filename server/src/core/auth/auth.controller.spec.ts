import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // REGISTER
  it('should call AuthService.register and return result', async () => {
    const dto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    };

    mockAuthService.register.mockResolvedValue({ message: 'Registration successful' });

    const result = await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'Registration successful' });
  });

  // LOGIN
  it('should call AuthService.login and return result', async () => {
    const dto = { email: 'test@test.com', password: '123456' };

    mockAuthService.login.mockResolvedValue({ message: 'Login successful' });

    const result = await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ message: 'Login successful' });
  });

  // REQUEST PASSWORD RESET
  it('should call AuthService.requestPasswordReset and return result', async () => {
    const dto = { email: 'test@test.com' };
    mockAuthService.requestPasswordReset.mockResolvedValue({
      message: 'OTP sent successfully',
    });

    const result = await controller.requestReset(dto);
    expect(service.requestPasswordReset).toHaveBeenCalledWith(dto.email);
    expect(result).toEqual({ message: 'OTP sent successfully' });
  });

  // RESET PASSWORD
  it('should call AuthService.resetPassword and return result', async () => {
    const dto = { email: 'test@test.com', otp: '123456', newPassword: 'newPass123' };

    mockAuthService.resetPassword.mockResolvedValue({
      message: 'Password reset successful',
    });

    const result = await controller.resetPassword(dto);
    expect(service.resetPassword).toHaveBeenCalledWith(
      dto.email,
      dto.otp,
      dto.newPassword,
    );
    expect(result).toEqual({ message: 'Password reset successful' });
  });
});

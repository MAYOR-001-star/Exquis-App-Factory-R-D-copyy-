import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
    expect(result).toEqual({ message: 'Registration successful' });
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('should call AuthService.login and return result', async () => {
    const dto = { email: 'test@test.com', password: '123456' };

    mockAuthService.login.mockResolvedValue({ message: 'Login successful' });

    const result = await controller.login(dto);
    expect(result).toEqual({ message: 'Login successful' });
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});

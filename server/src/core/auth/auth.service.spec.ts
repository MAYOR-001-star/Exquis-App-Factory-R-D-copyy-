import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if email already exists on register', async () => {
    mockUserModel.findOne.mockResolvedValue({ email: 'exists@test.com' });

    await expect(
      service.register({
        firstName: 'Test',
        lastName: 'User',
        email: 'exists@test.com',
        password: '123456',
        confirmPassword: '123456',
      }),
    ).rejects.toThrow('Email already in use');
  });

  it('should return success message on valid register', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpass' as never);
    mockUserModel.create.mockResolvedValue({
      _id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      role: 'user',
    });

    const result = await service.register({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });

    expect(result.message).toBe('Registration successful');
  });
});

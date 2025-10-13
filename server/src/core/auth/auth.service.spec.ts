import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
// import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'; // still import so TypeScript knows types
import { MailService } from '../mail/mail.service';

const mockUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockMailService = {
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetOTP: jest.fn().mockResolvedValue(undefined),
};

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpass'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue({
      _id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
    });

    const result = await service.register({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: 'test@test.com',
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(mockMailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'test@test.com',
      'Test',
    );
    expect(result).toEqual({
      message: 'Registration successful. A welcome email has been sent.',
      user: {
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
      },
    });
  });
});

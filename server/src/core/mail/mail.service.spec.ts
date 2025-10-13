import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

// mock nodemailer
const sendMailMock = jest.fn().mockResolvedValue(true);
const createTransportMock = jest.fn().mockReturnValue({
  sendMail: sendMailMock,
});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: sendMailMock,
  })),
}));

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    (nodemailer.createTransport as jest.Mock).mockImplementation(
      createTransportMock,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send welcome email', async () => {
    await service.sendWelcomeEmail('test@example.com', 'Mayor');
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Welcome'),
      }),
    );
  });

  it('should send password reset OTP email', async () => {
    await service.sendPasswordResetOTP('test@example.com', '123456');
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: expect.stringContaining('Password Reset'),
        html: expect.stringContaining('123456'),
      }),
    );
  });

  it('should handle sendMail error gracefully', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('SMTP Error'));

    await expect(
      service.sendWelcomeEmail('fail@example.com', 'John'),
    ).resolves.not.toThrow();
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});

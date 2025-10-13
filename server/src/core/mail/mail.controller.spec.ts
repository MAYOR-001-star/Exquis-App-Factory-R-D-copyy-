import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

describe('MailController', () => {
  let controller: MailController;
  let mailService: MailService;

  const mockMailService = {
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call MailService.sendWelcomeEmail and return success message', async () => {
    const response = await controller.sendTestEmail();

    expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(
      'mayorkunabdulazeez01@gmail.com',
      'Mayor',
    );
    expect(response).toEqual({ message: '✅ Test email sent successfully!' });
  });
});

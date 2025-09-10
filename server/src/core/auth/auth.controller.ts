import { Controller, Post, Body, Res, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

	@Inject() private readonly authService: AuthService;

	@Post()
	async register(
		@Res() res: Response,
		@Body() createAuthDto: CreateAuthDto
	) {
		return this.authService.register();
	}

	@Post()
	async login(
		@Res() res: Response,
		@Body() createAuthDto: CreateAuthDto
	) {
		return this.authService.login();
	}


}

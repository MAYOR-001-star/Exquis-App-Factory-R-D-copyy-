import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {


	async login() {
		return 'This action adds a new auth';
	}

	async register() {
		return `This action returns all auth`;
	}


}

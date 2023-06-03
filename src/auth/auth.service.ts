import { hashPassword, verifyPassword } from '@/common/utils/password';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { ResAccountDto } from './dto/res_account.dto';

@Injectable()
export class AuthService {
	constructor(
		private repository: AuthRepository,
		private jwtService: JwtService
	) { }

	async signUp(data: CreateAccountDto): Promise<ResAccountDto> {
		data.password = await hashPassword(data.password);
		const newUser = await this.repository.create(data);
		const { password, ...rest } = newUser;
		return rest;
	}

	async validateUser(email: string, pass: string): Promise<ResAccountDto | null> {
		const account = await this.repository.findByEmail(email);
		if (!account || !(await verifyPassword(pass, account.password))) {
			return null;
		}
		const { password, ...rest } = account;
		return rest;
	}

	async signIn(account: any): Promise<{ accessToken: string; }> {
		const payload = { sub: account.id, email: account.email };
		return {
			accessToken: await this.jwtService.signAsync(
				payload,
			),
		};
	}

	async getById(id: number): Promise<ResAccountDto | null> {
		const account = await this.repository.findById(id);
		if (!account) {
			return null;
		}
		const { password, ...rest } = account;
		return rest;
	}

	async updatePassword(id: number, newPassword: string): Promise<void> {
		newPassword = await hashPassword(newPassword);
		this.repository.updatePassword(id, newPassword);
	}

	async updateRole(id: number, isAdmin: boolean): Promise<void> {
		await this.repository.updateRole(id, isAdmin);
		if (isAdmin) {
			await this.repository.updateBan(id, false);
		}
	}

	async updateBan(id: number, isBanned: boolean): Promise<void> {
		await this.repository.updateBan(id, isBanned);
	}
}

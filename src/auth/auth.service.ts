import { hashPassword, verifyPassword } from '@/common/utils/password';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountWithoutPasswordDto } from './dto/res-account.dto';

@Injectable()
export class AuthService {
	constructor(
		private repository: AuthRepository,
		private jwtService: JwtService
	) { }

	async signUp(data: CreateAccountDto): Promise<AccountWithoutPasswordDto> {
		data.password = await hashPassword(data.password);
		const newUser = await this.repository.create(data);
		const { password, ...rest } = newUser;
		return rest;
	}

	async validateUser(email: string, pass: string): Promise<AccountWithoutPasswordDto | null> {
		const account = await this.repository.findByEmail(email);
		if (!account || !(await verifyPassword(pass, account.password))) {
			return null;
		}
		const { password, ...rest } = account;
		return rest;
	}

	async signIn(id: number, email: string): Promise<string> {
		const payload = { sub: id, email: email };
		return await this.jwtService.signAsync( payload );
	}

	async getById(id: number): Promise<AccountWithoutPasswordDto | null> {
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

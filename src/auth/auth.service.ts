import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { SignInDto } from './dto/sign-in.dto';
import { hashPassword, verifyPassword } from '@/common/utils/password';
import { AccountEntity } from './entity/auth.entity';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
	constructor(
		private repository: AuthRepository,
		private jwtService: JwtService
	) { }

	async signUp(data: CreateAccountDto): Promise<Account> {
		data.password = await hashPassword(data.password);
		return await this.repository.create(data);
	}

	async signIn({ email, password }: SignInDto)
		: Promise<{
			accessToken: string,
			account: AccountEntity,
		}> {
		const account = await this.repository.findByEmail(email);
		if (!account) {
			throw new NotFoundException();
		}

		if (!(await verifyPassword(password, account.password))) {
			throw new UnauthorizedException();
		}

		const payload = { sub: account.id, email: account.email };
		return {
			accessToken: await this.jwtService.signAsync(
				payload,
				{ secret: jwtConstants.secret }
			),
			account
		};
	}
}

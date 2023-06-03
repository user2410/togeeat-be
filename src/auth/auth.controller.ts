import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ResAccountDto } from './dto/res_account.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClientKnownRequestExceptionFilter } from '@/prisma-client-exception/prisma-client-exception.filter';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('signup')
	@ApiOperation({ summary: 'Create an account without user information' })
	@ApiCreatedResponse({ type: ResAccountDto })
	@UseFilters(PrismaClientKnownRequestExceptionFilter)
	async signup(@Body() data: CreateAccountDto): Promise<ResAccountDto> {
		const newAccount: ResAccountDto = await this.authService.signUp(data);
		delete newAccount['password'];
		return newAccount;
	}

	@Post('signin')
	@ApiOperation({ summary: 'Sign in with email and password' })
	@ApiOkResponse()
	async signIn(@Body() signInDto: SignInDto)
		: Promise<{
			accessToken: string,
			account: ResAccountDto,
		}> {
		const { accessToken, account } = await this.authService.signIn(signInDto);
		const resAccount: ResAccountDto = account;
		delete resAccount['password'];
		return {
			accessToken: accessToken,
			account: resAccount,
		};
	}
}

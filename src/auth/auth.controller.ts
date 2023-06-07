import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Request, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ResAccountDto } from './dto/res_account.dto';
import { PrismaClientKnownRequestExceptionFilter } from '@/prisma/prisma-client-exception.filter';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

	constructor(private authService: AuthService) { }

	@Post('signup')
	@ApiOperation({ summary: 'Create an account without user information' })
	@ApiCreatedResponse({ type: ResAccountDto })
	@UseFilters(PrismaClientKnownRequestExceptionFilter)
	async signup(@Body() data: CreateAccountDto): Promise<ResAccountDto> {
		delete data['isAdmin'];
		delete data['isBanned'];
		const newAccount: ResAccountDto = await this.authService.signUp(data);
		return newAccount;
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	@ApiOperation({ summary: 'Sign in with email and password' })
	@ApiOkResponse()
	async signIn(@Request() req) {
		const accessToken = await this.authService.signIn(req.user);
		return {
			...accessToken,
			user: req.user,
		}
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get currently signed in user, along with associated user profile (if exists)' })
	@ApiOkResponse()
	getProfile(@Request() req) {
		return req.user;
	}

	@Patch('password')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Users update their own password' })
	@ApiOkResponse()
	async updatePassword(@Request() req, @Body() { newPassword }: { newPassword: string }) {
		this.authService.updatePassword(req.user.id, newPassword);
	}

	@Patch('role/:id')
	@UseGuards(JwtAuthGuard, AdminGuard)
	@ApiOperation({ summary: 'Admin update role of another user' })
	@ApiOkResponse()
	async updatePermission(@Request() req, @Param() { id }, @Body() { newRole }: { newRole: string }) {
		const account = await this.authService.getById(+id);
		if (!account) {
			throw new NotFoundException();
		}

		// check newRole parameter
		if (newRole !== 'ADMIN' && newRole !== 'USER') {
			throw new BadRequestException();
		}
		// update user role
		this.authService.updateRole(+id, newRole === 'ADMIN');
	}

	@Patch('ban/:id')
	@UseGuards(JwtAuthGuard, AdminGuard)
	@ApiOperation({ summary: 'Admin restrict or lift restriction on another user' })
	@ApiOkResponse()
	async updateBan(@Request() req, @Param() { id }, @Body() { isBanned }: { isBanned: string }) {
		const account = await this.authService.getById(+id);
		if (!account) {
			throw new NotFoundException();
		}

		if (isBanned !== 'true' && isBanned !== 'false') {
			throw new BadRequestException();
		}

		this.authService.updateBan(+id, isBanned === 'true');
	}
}

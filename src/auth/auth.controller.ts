import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Request, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AccountWithoutPasswordDto, ResAccountDto } from './dto/res-account.dto';
import { PrismaKnownRequestExceptionFilter } from '@/prisma/prisma-client-exception.filter';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { UserEntity } from '@/users/entity/user.entity';
import { AccountEntity } from './entity/auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

	constructor(
    private authService: AuthService, 
    private userService: UsersService
  ) { }

	@Post('signup')
	@ApiOperation({ summary: 'Create an account without user information' })
	@ApiCreatedResponse({ type: AccountWithoutPasswordDto })
	@UseFilters(PrismaKnownRequestExceptionFilter)
	async signup(@Body() data: CreateAccountDto & CreateUserDto): Promise<{accessToken: string} & ResAccountDto> {
		const {
      email, password,
      address, age, avatar, backgroundImage, phone, description, name, nationality, languageSkills, isPublic
    } = data;
    const accountDto : CreateAccountDto = {email, password};
    const userDto: CreateUserDto = {address, age, avatar, backgroundImage, phone, description, name, nationality, languageSkills, isPublic};

		const newAccount: AccountWithoutPasswordDto = await this.authService.signUp(accountDto);
    const newUser: UserEntity = await this.userService.create(newAccount.id, userDto);
    const accessToken = await this.authService.signIn(newAccount.id, email);

		return {
      accessToken,
      account: {
        ...newAccount,
        user: newUser
      }
    };
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	@ApiOperation({ summary: 'Sign in with email and password' })
	@ApiOkResponse()
	async signIn(@Request() req) : Promise<{accessToken: string} & ResAccountDto> {
    const {id, email} = req.user;
		const accessToken = await this.authService.signIn(id, email);
    const userInfo = await this.userService.findById(id);
    
		return {
			accessToken,
			account: {
        ...req.user,
        user: userInfo
      },
		}
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get currently signed in user, along with associated user profile (if exists)' })
	@ApiOkResponse()
	async getProfile(@Request() req): Promise<ResAccountDto> {
    const user = await this.userService.findById(req.user.id);
		return {
      account: {
        ...req.user,
        user,
      }
    };
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

import { Body, ConflictException, Controller, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestExceptionFilter } from '@/prisma/prisma-client-exception.filter';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {

	constructor(private service: UsersService) { }

	@Post()
	@UseGuards(JwtAuthGuard)
	@UseFilters(PrismaClientKnownRequestExceptionFilter)
	async create(@Request() req, @Body() data: CreateUserDto): Promise<UserEntity> {
		const user = await this.service.findByAccountId(req.user.id);
		if (user) {
			throw new ConflictException('Already created user info');
		}

		const newUser = await this.service.create(req.user.id, data);
		if (!newUser) {
			throw new InternalServerErrorException();
		}
		return newUser;
	}

	@Get(':id')
	async findById(@Param('id') id: number): Promise<UserEntity> {
		const user = await this.service.findById(id);
		if (!user) {
			throw new NotFoundException();
		}
		delete user['account']['password'];
		return user;
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
		const user = await this.service.findById(+id);
		if (!user) {
			throw new NotFoundException();
		}
		return await this.service.update(+id, data);
	}
}

import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestExceptionFilter } from '@/prisma-client-exception/prisma-client-exception.filter';

@Controller('users')
@ApiTags('users')
export class UsersController {

	constructor(private service: UsersService) { }

	@Post()
	@UseFilters(PrismaClientKnownRequestExceptionFilter)
	async create(@Body() data: CreateUserDto): Promise<UserEntity> {
		const user = await this.service.create(data);
		if (!user) {
			throw new InternalServerErrorException();
		}
		return user;
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

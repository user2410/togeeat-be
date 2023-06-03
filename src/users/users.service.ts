import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

export type User = any;

@Injectable()
export class UsersService {

	constructor(private repository: UsersRepository) { }

	async create(data: CreateUserDto): Promise<UserEntity | null> {
		return await this.repository.create(data);
	}

	async findById(id: number): Promise<UserEntity | null> {
		return await this.repository.getById(id);
	}

	async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
		delete data['accountId'];
		return await this.repository.update(id, data);
	}
}

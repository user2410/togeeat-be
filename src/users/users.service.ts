import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

export type User = any;

@Injectable()
export class UsersService {

	constructor(private repository: UsersRepository) { }

	async create(accountId: number, data: CreateUserDto): Promise<UserEntity> {
		return await this.repository.create(accountId, data);
	}

	async findById(id: number, includeAccount: boolean = false): Promise<UserEntity | null> {
		return await this.repository.getById(id, includeAccount);
	}

	async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
		return await this.repository.update(id, data);
	}
}

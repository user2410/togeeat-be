import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchingService } from '@/common/generic/search-service';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { Hobby } from '@prisma/client';
import { CreateHobbyDto } from './dto/create-hobby.dto';

export type User = any;

@Injectable()
export class UsersService extends SearchingService {

  constructor(private repository: UsersRepository) {
    super();
  }

  prepareFilterParam(params: object): object {
    const paramObj = {};
    Object.keys(params).forEach(key => {
      switch (key) {
        case 'name': case 'nationality': case 'languageSkills':
          paramObj[key] = { contains: params[key], mode: 'insensitive' };
          break;
        case 'hobby':
          paramObj['hobbies'] = { some: { hobby: { name: { contains: params[key], mode: 'insensitive' } } } };
          break;
        default:
          paramObj[key] = params[key];
      }
    });
    return paramObj;
  }

  async findAll(query: SearchQueryDto): Promise<PaginationDto> {
    const { limit, offset, sortParam, filterParam } = this.prepareQuery(query, false);
    return await this.repository.find({ limit, offset }, sortParam, filterParam);
  }

  async create(accountId: number, data: CreateUserDto): Promise<UserEntity> {
    return await this.repository.create(accountId, data);
  }

  async findById(id: number, includeAccount: boolean = false): Promise<UserEntity | null> {
    return await this.repository.getById(id, includeAccount);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    return await this.repository.update(id, data);
  }

  async createHobby(data: CreateHobbyDto): Promise<Hobby> {
    return await this.repository.createHobby(data.name);
  }

  async getHobbies(): Promise<Hobby[]> {
    return await this.repository.getHobbies();
  }

  async assignHobby(userId: number, hobbyId: number): Promise<void> {
    await this.repository.assignHobby(userId, hobbyId);
  }
}

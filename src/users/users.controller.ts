import { Body, Controller, Get, NotFoundException, Param, Patch, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {

	constructor(private service: UsersService) { }

  @Get()
  @UsePipes(SearchQueryPipe)
  @ApiOperation({ summary: 'Get all users, filter by fields' })
  async findAll(@Query() query: SearchQueryDto): Promise<PaginationDto> {
    return await this.service.findAll(query);
  }

	@Get(':id')
	@ApiOperation({ summary: 'Get user information, include associated account information' })
	async findById(@Param('id') id: number): Promise<UserEntity> {
		const user = await this.service.findById(id, true);
		if (!user) {
			throw new NotFoundException();
		}
		delete user['account']['password'];
		return user;
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update user profile' })
	async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
		const user = await this.service.findById(+id);
		if (!user) {
			throw new NotFoundException();
		}
		return await this.service.update(+id, data);
	}
}

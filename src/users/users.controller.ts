import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { Body, ConflictException, Controller, Get, NotFoundException, Param, Patch, Post, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Controller('users')
@ApiTags('users')
export class UsersController {

	constructor(private service: UsersService) { }

  @Get('user')
  @UsePipes(SearchQueryPipe)
  @ApiOperation({ summary: 'Find users, filter by fields' })
  async findAll(@Query() query: SearchQueryDto): Promise<PaginationDto> {
    return await this.service.findAll(query);
  }

	@Get('user/:id')
  @UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get user information, including associated account information' })
	async findById(@Param('id') id: number): Promise<UserEntity> {
		const user = await this.service.findById(id, true);
		if (!user) {
			throw new NotFoundException();
		}
		delete user['account']['password'];
		return user;
	}

	@Patch('user/update')
  @UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Update user profile' })
	async update(@Request() req, @Body() data: UpdateUserDto) {
		const currentUserId: number = req.user.id;
		return await this.service.update(currentUserId, data);
	}

  // Hobby section
  @Post('hobby')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new hobby' })
  async createHobby(@Body() dto: CreateHobbyDto) {
    return await this.service.createHobby(dto);
  }

  @Get('hobby')
  @ApiOperation({ summary: 'Get all hobbies' })
  async getHobies() {
    return await this.service.getHobbies();
  }

  @Patch('hobby/assign/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Assign a hobby to current user' })
  async assignHobbyToUser(@Request() req, @Param('id') id: number) {
    const currentUserId: number = req.user.id;
    try{
      await this.service.assignHobby(currentUserId, id);
    }catch(err){
      // console.error(err);
      // console.log(err instanceof PrismaClientKnownRequestError); // false
      // console.log(err.code); // P2002
      throw new ConflictException({ message: 'Hobby already assigned'});
    }
  }
}

import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, Request, UnauthorizedException, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingService } from './matching.service';
// import { UpdateMatchingDto } from './dto/update-matching.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { PrismaClientValidationExceptionFilter } from '@/prisma/prisma-client-exception.filter';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MatchingPaginationDto } from './dto/pagination.dto';
import { MatchingEntity } from './entities/matching.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserInfoGuard } from '@/auth/guards/user-info.guard';


@Controller('matching')
@ApiTags('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) { }

  @Post()
  @UseGuards(JwtAuthGuard, UserInfoGuard)
  @ApiOperation({ summary: 'Create a new matching record' })
  @ApiCreatedResponse({ type: MatchingEntity })
  async create(@Request() req, @Body() createMatchingDto: CreateMatchingDto): Promise<MatchingEntity> {
    const currentUserId: number = req.user.userId;
    if (createMatchingDto.matchingDate.valueOf() < (new Date()).valueOf()) {
      throw new BadRequestException({ message: 'Invalid matching date' });
    }
    return this.matchingService.create(currentUserId, createMatchingDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all matching records, response is paginated' })
  @ApiOkResponse({ type: [MatchingPaginationDto] })
  @UsePipes(SearchQueryPipe)
  @UseFilters(PrismaClientValidationExceptionFilter)
  async list(@Query() query: SearchQueryDto): Promise<PaginationDto> {
    // console.log(query);
    return await this.matchingService.list(query);
  }

  @Get('my-matchings')
  @UseGuards(JwtAuthGuard, UserInfoGuard)
  @UsePipes(new SearchQueryPipe())
  @ApiOperation({ summary: 'Get all matching created by current user' })
  async getMyMatchings(@Request() req, @Query() query: SearchQueryDto): Promise<PaginationDto> {
    const currentUserId: number = req.user.userId;
    return await this.matchingService.getMatchingsOfUser(currentUserId, query);
    // const res = result.items.map(item => {
    //   return {
    //     ...item.user,
    //     item.
    //   }
    // })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a matching by id' })
  @ApiOkResponse({ type: MatchingEntity })
  async findOne(@Param('id') id: number): Promise<MatchingEntity> {
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException(`Matching with id=${id} not found`);
    }
    return matching!;
  }

  // @Patch(':id')
  // @ApiOkResponse()
  // async update(@Param('id') id: string, @Body() updateMatchingDto: UpdateMatchingDto) {
  //   return await this.matchingService.update(+id, updateMatchingDto);
  // }

  @Patch('join/:id')
  @UseGuards(JwtAuthGuard, UserInfoGuard)
  @UseFilters(PrismaClientValidationExceptionFilter)
  @ApiOperation({ summary: 'Join current user to matching with id' })
  @ApiOkResponse()
  async joinMatching(@Request() req, @Param('id') id: string) {
    const currentUserId: number = req.user.userId;
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException();
    }
    if (matching.ownerId === currentUserId) {
      return
    }
    return await this.matchingService.joinUser(+id, currentUserId);
  }

  @Patch('/leave/:id')
  @UseGuards(JwtAuthGuard, UserInfoGuard)
  @ApiOperation({ summary: 'Current user leave matching with id, matching owner can remove other members from the matching' })
  async leaveMatching(@Request() req, @Param('id') id: string, @Query('userId') userId: string) {
    const currentUserId: number = req.user.userId;
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException();
    }
    // matching owner removes member from matching
    if (currentUserId === matching.ownerId) {
      const uid = +userId;
      if (!uid) {
        throw new BadRequestException('Missing member id');
      }
      this.matchingService.removeUser(+id, uid);
      return;
    }
    // a member leaves
    if (matching.userMatchings?.find(um => um.userId === currentUserId)) {
      this.matchingService.removeUser(+id, currentUserId);
    }
    throw new ForbiddenException('Not allowed operation');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserInfoGuard)
  @ApiOperation({ summary: 'Delete a matching' })
  @ApiOkResponse()
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    const currentUserId: number = req.user.userId;
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException();
    }
    if (matching.ownerId !== currentUserId) {
      throw new UnauthorizedException();
    }
    return await this.matchingService.remove(+id);
  }
}

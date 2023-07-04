import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Query, Request, UnauthorizedException, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingService } from './matching.service';
// import { UpdateMatchingDto } from './dto/update-matching.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MatchingPaginationDto } from './dto/pagination.dto';
import { MatchingEntity, MatchingStatus } from './entities/matching.entity';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ChatService } from '@/chat/chat.service';


@Controller('matching')
@ApiTags('matching')
export class MatchingController {
  constructor(
    private readonly matchingService: MatchingService,
    private readonly chatService: ChatService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new matching record' })
  @ApiCreatedResponse({ type: MatchingEntity })
  async create(@Request() req, @Body() createMatchingDto: CreateMatchingDto) {
    const currentUserId: number = req.user.id;
    const {matchingDate, duration, matchingType} = createMatchingDto;
    if(
      (matchingType == 'QUICK' && !duration) || 
      (matchingType == 'YOTEI' && !matchingDate)
    ) {
      throw new BadRequestException({message: 'Missing duration or matching date'});
    }
    if (matchingDate && matchingDate.valueOf() < (new Date()).valueOf()) {
      throw new BadRequestException({ message: 'Invalid matching date' });
    }

    const newMatching = await this.matchingService.create(currentUserId, createMatchingDto);
    
    // create a group chat with name = `matching_group_${matching.id}`
    const newGroup = await this.chatService.createGroup(currentUserId, {
      name: `matching_group_${newMatching.id}`,
      isGroup: true,
      members: [],
    });
    return  {
      ...newMatching,
      group: newGroup,
    };
  }

  @Get()
  @ApiQuery({ name: 'ownerName', type: 'string', required: false, description: 'search for matchings whose owners whose name conatains this case-insensitive string'})
  @ApiQuery({ name: 'matchBefore', type: 'string', required: false, description: 'standard Date.toISOString() string'})
  @ApiQuery({ name: 'matchAfter', type: 'string', required: false, description: 'standard Date.toISOString() string'})
  @ApiQuery({ name: 'createdBefore', type: 'string', required: false, description: 'standard Date.toISOString() string'})
  @ApiQuery({ name: 'createdAfter', type: 'string', required: false, description: 'standard Date.toISOString() string'})
  @ApiQuery({name: 'status', enum: MatchingStatus, required: false, description: 'status of matching'})
  @ApiOperation({ summary: 'List all matching records, response is paginated. Filter matchings' })
  @ApiOkResponse({ type: [MatchingPaginationDto] })
  @UsePipes(SearchQueryPipe)
  async list(@Query() query: SearchQueryDto): Promise<PaginationDto> {
    // console.log(query);
    return await this.matchingService.list(query);
  }

  @Get('my-matchings')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new SearchQueryPipe())
  @ApiOperation({ summary: 'Get all matching created by current user. Filter matchings' })
  @ApiOkResponse({ type: [MatchingPaginationDto] })
  async getMyMatchings(@Request() req, @Query() query: SearchQueryDto): Promise<PaginationDto> {
    const currentUserId: number = req.user.id;
    return await this.matchingService.getMatchingsOfUser(currentUserId, query);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'memberName', type: 'string', required: false, description: 'search for matching members name conatains this case-insensitive string'})
  async searchMatchingMembersByName(@Request() req, @Query('memberName') memberName: string) {
    const currentUserId: number = req.user.id;
    if(!memberName) {
      throw new BadRequestException({message: 'Missing member name'})
    }
    return this.matchingService.searchMatchingMembersByName(currentUserId, memberName);
  }

  @Get('group')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get group chat of matching with id' })
  @ApiOkResponse()
  async getGroupOfMatching(@Request() req, @Query('id') matchingId: string) {
    const currentUserId: number = req.user.id;
    if(!matchingId) {
      throw new BadRequestException({message: 'Missing matching id'})
    }
    const matching = await this.matchingService.findOne(+matchingId);
    if(!matching) {
      throw new NotFoundException({message: 'Matching not found'});
    }
    const res = await this.chatService.searchGroup({
      name: `matching_group_${matching.id}`,
      isGroup: true,
      exact: true,
    });
    if(res.count == 0) {
      throw new NotFoundException({message: 'Group not found'});
    }
    return res.items[0];
  }    

  @Get(':id')
  @ApiOperation({ summary: 'Get a matching by id' })
  @ApiOkResponse({ type: MatchingEntity })
  async findOne(@Param('id') id: string): Promise<MatchingEntity> {
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException(`matching with id=${id} not found`);
    }
    return matching!;
  }

  // @Patch(':id')
  // @ApiOkResponse()
  // async update(@Param('id') id: string, @Body() updateMatchingDto: UpdateMatchingDto) {
  //   return await this.matchingService.update(+id, updateMatchingDto);
  // }

  @Patch('join/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Join current user to matching with id' })
  @ApiOkResponse()
  async joinMatching(@Request() req, @Param('id') id: string) {
    await this.matchingService.joinUser(+id, req.user.id);

    // join user to matching group chat
    const res = await this.chatService.searchGroup({
      name: `matching_group_${id}`,
      isGroup: true,
      exact: true,
    });
    if(res.count === 0) {
      return;
    }
    await this.chatService.joinGroup(req.user.id, res.items[0].id);
  }

  @Patch('/leave/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Current user leave matching with id, matching owner can remove other members from the matching' })
  @ApiOkResponse()
  async leaveMatching(@Request() req, @Param('id') id: string, @Query('userId') userId: string) {
    const currentUserId: number = req.user.id;
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException();
    }

    // get corresponding chat room id
    const searchChatGroupRes = await this.chatService.searchGroup({
      name: `matching_group_${id}`,
      isGroup: true,
      exact: true,
    });
    
    // matching owner removes member from matching
    if (currentUserId === matching.ownerId) {
      const uid = +userId;
      if (!uid) {
        throw new BadRequestException('missing member id');
      }
      await this.matchingService.removeUser(+id, uid);

      if(searchChatGroupRes.count > 0) {
        await this.chatService.leaveGroup(uid, searchChatGroupRes.items[0].id);
      }
      return;
    }
    // a member leaves
    await this.matchingService.removeUser(+id, currentUserId);
    // leave group chat
    if(searchChatGroupRes.count > 0) {
      await this.chatService.leaveGroup(currentUserId, searchChatGroupRes.items[0].id);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a matching' })
  @ApiOkResponse()
  async remove(@Request() req, @Param('id') id: string): Promise<void> {
    const currentUserId: number = req.user.id;
    const matching = await this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException();
    }
    if (matching.ownerId !== currentUserId) {
      throw new ForbiddenException('not allowed operation');
    }

    // delete group chat
    const searchChatGroupRes = await this.chatService.searchGroup({
      name: `matching_group_${id}`,
      isGroup: true,
      exact: true,
    });
    if(searchChatGroupRes.count > 0) {
      await this.chatService.deleteGroup(searchChatGroupRes.items[0].id);
    }

    return await this.matchingService.remove(+id);
  }
}

import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseFilters, UsePipes } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingService } from './matching.service';
// import { UpdateMatchingDto } from './dto/update-matching.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { PrismaClientValidationExceptionFilter } from '@/prisma-client-exception/prisma-client-exception.filter';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MatchingPaginationDto } from './dto/pagination.dto';
import { MatchingEntity } from './entities/matching.entity';


@Controller('matching')
@ApiTags('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new matching record' })
  @ApiCreatedResponse({ type: MatchingEntity })
  async create(@Body() createMatchingDto: CreateMatchingDto) {
    return this.matchingService.create(createMatchingDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all matching records, response is paginated' })
  @ApiOkResponse({ type: [MatchingPaginationDto] })
  @UsePipes(new SearchQueryPipe())
  @UseFilters(PrismaClientValidationExceptionFilter)
  async listActive(@Query() query: SearchQueryDto): Promise<PaginationDto> {
    // console.log(query);
    return await this.matchingService.listActive(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a matching by id' })
  @ApiOkResponse({ type: MatchingEntity })
  async findOne(@Param('id') id: number): Promise<MatchingEntity> {
    const matching = this.matchingService.findOne(+id);
    if (!matching) {
      throw new NotFoundException(`Matching with id=${id} not found`);
    }
    return matching;
  }

  // @Patch(':id')
  // @ApiOkResponse()
  // async update(@Param('id') id: string, @Body() updateMatchingDto: UpdateMatchingDto) {
  //   return await this.matchingService.update(+id, updateMatchingDto);
  // }

  @Patch(':id')
  @ApiOperation({ summary: 'Update matching status to CLOSED, executed by priviledged services only' })
  @ApiOkResponse()
  async update(@Param('id') id: string): Promise<void> {
    return await this.matchingService.updateStatus(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a matching' })
  @ApiOkResponse()
  async remove(@Param('id') id: number): Promise<void> {
    return await this.matchingService.remove(+id);
  }
}

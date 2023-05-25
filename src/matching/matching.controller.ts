import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Query, NotFoundException, UseFilters } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { CreateMatchingDto } from './dto/create-matching.dto';
// import { UpdateMatchingDto } from './dto/update-matching.dto';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MatchingEntity } from './entities/matching.entity';
import { MatchingStatus } from '@prisma/client';
import { PrismaClientValidationExceptionFilter } from '@/prisma-client-exception/prisma-client-exception.filter';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { MatchingPaginationDto } from './dto/pagination.dto';


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
  @ApiOkResponse({ type: MatchingEntity })
  async findOne(@Param('id') id: number): Promise<MatchingStatus> {
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

  @Delete(':id')
  @ApiOkResponse()
  async remove(@Param('id') id: number): Promise<void> {
    return await this.matchingService.remove(+id);
  }
}

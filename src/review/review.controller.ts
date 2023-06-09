import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto, SearchQueryPipe } from '@/common/pipes/search-query.pipe';
import { Body, Controller, Get, NotFoundException, Param, Post, Query, Request, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './review.service';

@Controller('review')
@ApiTags('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() data: CreateReviewDto) : Promise<ReviewEntity> {
    return await this.reviewService.create(req.user.id, data);
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const review = await this.reviewService.getById(+id);
    if(!review) {
      throw new NotFoundException({message: `review with userId = ${id} not found`});
    }
    return review;
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(SearchQueryPipe)
  @ApiQuery({ name: 'user1Id', type: 'number', required: false, description: 'search for reviews made by user1 with given id'})
  @ApiQuery({ name: 'user2Id', type: 'number', required: false, description: 'search for reviews about user2 with given id'})
  async find(@Query() query: SearchQueryDto): Promise<PaginationDto> {
    return await this.reviewService.find(query);
  }
}

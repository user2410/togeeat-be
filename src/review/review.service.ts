import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { SearchingService } from '@/common/generic/search-service';

@Injectable()
export class ReviewService extends SearchingService {
  constructor(private repository: ReviewRepository) {
    super();
  }

  async create(userId: number, data: CreateReviewDto) {
    if(userId === data.user2Id) {
      throw new ConflictException('Not allowed to review yourself');
    }
    return await this.repository.create(userId, data);
  }

  async getById(id: number) {
    return await this.repository.findOne(id);
  }

  prepareFilterParam(params: object): object {
    const paramObj: object = {};
    Object.keys(params).forEach(key => {
      switch (key) {
        case 'user1Id': case 'user2Id': case 'parentCommentId': case 'star':
          const num = parseInt(params[key]);
          if(Number.isNaN(num)) {
            throw new BadRequestException(`${key} = ${params[key]}`);
          }
          paramObj[key] = num;
          break;
        case 'content':
          paramObj[key] = { contains: params[key], mode: 'insensitive' };
          break;

      }
    });
    return paramObj;
  }

  async find(query: SearchQueryDto) {
    const {limit, offset, sortParam, filterParam} = this.prepareQuery(query);
    return await this.repository.find({limit, offset}, sortParam, filterParam);
  }
}

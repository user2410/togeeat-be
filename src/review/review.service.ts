import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';

@Injectable()
export class ReviewService {
  constructor(private repository: ReviewRepository) {}

  async create(userId: number, data: CreateReviewDto) {
    return await this.repository.create(userId, data);
  }

  async getById(id: number) {
    return await this.repository.findOne(id);
  }

  private prepareFilterParam(params: object): object {
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
    query.limit = query.limit ? query.limit : 10;
    query.offset = query.offset ? query.offset : 0;
    let sortParam = {}, filterParam = {};
    if (query.sort) {
      sortParam[query.sort] = query.order;
    } else {
      sortParam['createdAt'] = 'desc';
    }
    if (query.rest) {
      filterParam = this.prepareFilterParam(query.rest);
    }
    return await this.repository.find(query, filterParam);
  }
}

import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { Injectable } from '@nestjs/common';
import { MatchingStatus } from '@prisma/client';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingEntity } from './entities/matching.entity';
import { MatchingRepository } from './matching.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Service layer may do other things... e.g. send email of add a CPU-heavy task to a queue 
 */
@Injectable()
export class MatchingService {

  // constructor(private prisma: PrismaService) { }
  constructor(private repository: MatchingRepository) { }

  async create(data: CreateMatchingDto) {
    return await this.repository.create(data);
  }

  async listActive(query: SearchQueryDto): Promise<PaginationDto> {
    query.limit = query.limit ? query.limit : 10;
    query.offset = query.offset ? query.offset : 0;
    const sortParam = {};
    if (query.sort) {
      sortParam[query.sort] = query.order;
    }
    return this.repository.listActive(query, sortParam);
  }

  async findOne(id: number): Promise<MatchingEntity | null> {
    return await this.repository.findOne(id);
  }

  // async update(id: number, updateMatchingDto: UpdateMatchingDto) {
  //   return `This action updates a #${id} matching`;
  // }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateStatus() {
    console.log('Updating matching status');
    await this.repository.updateStatus();
  }

  async remove(id: number): Promise<void> {
    this.repository.delete(id);
  }
}

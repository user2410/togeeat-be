import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { MatchingEntity } from './entities/matching.entity';
import { MatchingRepository } from './matching.repository';

/**
 * Service layer may do other things... e.g. send email of add a CPU-heavy task to a queue 
 */
@Injectable()
export class MatchingService {

  // constructor(private prisma: PrismaService) { }
  constructor(private repository: MatchingRepository) { }

  async create(data: CreateMatchingDto) {
    if (data.matchingDate.valueOf() < (new Date()).valueOf()) {
      throw new BadRequestException({ message: 'Invalid matching date' });
    }
    return await this.repository.create(data);
  }

  async listActive(query: SearchQueryDto): Promise<PaginationDto> {
    return this.repository.listActive(query);
  }

  async findOne(id: number): Promise<MatchingEntity | null> {
    return await this.repository.findOne(id);
  }

  // async update(id: number, updateMatchingDto: UpdateMatchingDto) {
  //   return `This action updates a #${id} matching`;
  // }

  async updateStatus(id: number): Promise<void> {
    await this.repository.updateStatus(id);
  }

  async remove(id: number): Promise<void> {
    this.repository.delete(id);
  }
}

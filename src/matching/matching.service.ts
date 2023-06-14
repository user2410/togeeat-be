import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { addMinutes, roundUpToMinute } from '@/common/utils/date';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingEntity } from './entities/matching.entity';
import { MatchingRepository } from './matching.repository';
import { SearchingService } from '@/common/generic/search-service';

/**
 * Service layer may do other things... e.g. send email of add a CPU-heavy task to a queue 
 */

@Injectable()
export class MatchingService extends SearchingService {
  constructor(private repository: MatchingRepository) {
    super();
  }

  async create(ownerId: number, data: CreateMatchingDto) {
    const { matchingDate } = data;
    data.matchingDate = matchingDate
      ? roundUpToMinute(matchingDate)
      : addMinutes(new Date(), data.duration!);
    const matching = await this.repository.create(ownerId, data);
    await this.repository.addUserToMatching(matching.id, ownerId);
    return matching;
  }

  prepareFilterParam(params: object): object {
    const paramObj: object = { matchingDate: { gte: new Date() } };
    Object.keys(params).forEach(key => {
      switch (key) {
        case 'ownerName':
          paramObj['owner'] = { name: { contains: params['ownerName'], mode: 'insensitive' } };
          break;
        case 'address': case 'desiredFood': case 'conversationTopics':
          paramObj[key] = { contains: params[key], mode: 'insensitive' };
          break;
        case 'matchBefore':
          paramObj['matchingDate'] = { lte: new Date(params[key]) };
          break;
        case 'matchAfter':
          paramObj['matchingDate'] = { gte: new Date(params[key]) };
          break;
        case 'createdBefore':
          paramObj['createdAt'] = { lte: new Date(params[key]) };
          break;
        case 'createdAfter':
          paramObj['createdAt'] = { gte: new Date(params[key]) };
          break;
        case 'id': case 'ownerId': case 'duration':
          const num = parseInt(params[key]);
          if (Number.isNaN(num)) {
            throw new BadRequestException({ message: `invalid ${key} = ${params[key]}` });
          }
          paramObj[key] = num;
          break;
        case 'status':
          if (params[key] === 'closed') {
            paramObj['matchingDate'] = { lte: new Date() };
          }
          break;
        default:
          paramObj[key] = params[key];
      }
    })
    console.log(paramObj);
    return paramObj;
  }

  async list(query: SearchQueryDto): Promise<PaginationDto> {
    const { limit, offset, sortParam, filterParam } = this.prepareQuery(query);
    return this.repository.list({ limit, offset }, sortParam, filterParam);
  }

  async getMatchingsOfUser(userId: number, query: SearchQueryDto): Promise<PaginationDto> {
    const { limit, offset, filterParam } = this.prepareQuery(query);
    return await this.repository.getMatchingsOfUser(userId, { limit, offset }, filterParam);
  }

  async findOne(id: number): Promise<MatchingEntity | null> {
    return await this.repository.findOne(id);
  }

  async joinUser(matchingId: number, userId: number) {
    const matching = await this.findOne(matchingId);
    if (!matching) {
      throw new NotFoundException(`matching with id=${matchingId} not found`);
    }
    if (matching.ownerId === userId) {
      return
    }

    let condition: string;

    // check ability to join
    condition = matching.matchingType === 'QUICK'
      // - quick: 1 active matching only
      ? `
      matching_type = 'QUICK'
      AND
      matching_date >= NOW()
      AND id IN (
        SELECT matching_id
        FROM user_matching
        WHERE user_id = ${userId}
      )
    `
      // - yotei: do not join 2 active matchings having the same matchingDate
      : `
      matching_type = 'YOTEI'
      AND
      matching_date = '${matching.matchingDate?.toISOString()}'
      AND id IN (
        SELECT matching_id
        FROM user_matching
        WHERE user_id = ${userId}
      )
    `;

    // get active matching
    const count = await this.repository.countMatching(condition);
    console.log('count =', count);
    if (count > 0) {
      throw new ConflictException({
        message: matching.matchingType === 'QUICK'
          ? 'already joined a quick matching'
          : `already joined a yotei matching at ${matching.matchingDate}`
      });
    }

    await this.repository.addUserToMatching(matchingId, userId);
  }

  async removeUser(matchingId: number, userId: number) {
    await this.repository.removeUserFromMatching(matchingId, userId);
  }

  // async update(id: number, updateMatchingDto: UpdateMatchingDto) {
  //   return `This action updates a #${id} matching`;
  // }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

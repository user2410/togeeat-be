import { PaginationDto } from '@/common/dto/pagination.dto';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { roundUpToMinute } from '@/common/utils/date';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { MatchingEntity } from './entities/matching.entity';
import { MatchingRepository } from './matching.repository';
/**
 * Service layer may do other things... e.g. send email of add a CPU-heavy task to a queue 
 */
@Injectable()
export class MatchingService {
  constructor(private repository: MatchingRepository) { }

  async create(ownerId: number, data: CreateMatchingDto) {
    const {matchingDate} = data;
    data.matchingDate = matchingDate ? roundUpToMinute(matchingDate) : matchingDate;
    const matching = await this.repository.create(ownerId, data);
    await this.repository.addUserToMatching(matching.id, ownerId);
    return matching;
  }

  private prepareFilterParam(params: object): object {
    const paramObj: object = {};
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
          if (Number.isNaN(num)){
            throw new BadRequestException({message: `invalid ${key} = ${params[key]}`});
          }
          paramObj[key] = num;
          break;
        case 'matchingDate': case 'createdAt': case 'updatedAt':
          paramObj[key] = new Date(params[key]);
          break;
        default:
          paramObj[key] = params[key];
      }
    })
    console.log(paramObj);
    return paramObj;
  }

  async list(query: SearchQueryDto): Promise<PaginationDto> {
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
    return this.repository.list(query, sortParam, filterParam);
  }

  async getMatchingsOfUser(userId: number, query: SearchQueryDto): Promise<PaginationDto> {
    query.limit = query.limit ? query.limit : 10;
    query.offset = query.offset ? query.offset : 0;
    return await this.repository.getMatchingsOfUser(userId, query);
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
    condition =  matching.matchingType === 'QUICK' 
    // - quick: 1 active matching only
    ? `
      matching_type = 'QUICK'
      AND
      created_at >= NOW() - INTERVAL '1 minute' * duration
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
    console.log('count =',count);
    if(count > 0) {
      throw new ConflictException({
        message: matching.matchingType === 'QUICK'
        ? 'already join a quick matching'
        : `already join a yotei matching at ${matching.matchingDate}`
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

import { Injectable } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
// import { UpdateMatchingDto } from './dto/update-matching.dto';
// import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchQueryDto } from '@/common/pipes/search-query.pipe';
import { MatchingStatus } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class MatchingService {

  constructor(private prisma: PrismaService) { }

  async create(data: CreateMatchingDto) {
    return await this.prisma.matchingStatus.create({
      data
    });
  }

  async listActive({ limit, offset, sort, order }: SearchQueryDto): Promise<PaginationDto> {
    const sortParam = {};
    if (sort) {
      sortParam[sort] = order;
    }
    const res = await this.prisma.$transaction([
      this.prisma.matchingStatus.count({ where: { status: true } }),
      this.prisma.matchingStatus.findMany({
        where: { status: true },
        orderBy: sortParam,
        skip: offset ? offset : 10,
        take: limit ? limit : 10,
      }),
    ]);

    return new PaginationDto(res[0], res[1]);
  }

  async findOne(id: number): Promise<MatchingStatus> {
    return await this.prisma.matchingStatus.findFirst({
      where: { id }
    })
  }

  // async update(id: number, updateMatchingDto: UpdateMatchingDto) {
  //   return `This action updates a #${id} matching`;
  // }

  async remove(id: number): Promise<void> {
    this.prisma.matchingStatus.delete({
      where: { id }
    });
  }
}

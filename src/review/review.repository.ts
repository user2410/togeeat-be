import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { SearchQueryDto } from "@/common/pipes/search-query.pipe";
import { PaginationDto } from "@/common/dto/pagination.dto";
import { ReviewEntity } from "./entities/review.entity";

@Injectable()
export class ReviewRepository {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, data: CreateReviewDto) : Promise<ReviewEntity> {
    return await this.prisma.reviewUser.create({
      data: {
        ...data,
        user1Id: userId
      }
    })
  }

  async findOne(id: number) : Promise<ReviewEntity | null>{
    return await this.prisma.reviewUser.findFirst({
      where: {id}
    })
  }

  async find({limit, offset}: SearchQueryDto, sortParam: object, filterParam: object) {
    const res = await this.prisma.$transaction([
      this.prisma.reviewUser.count({where: filterParam}),
      this.prisma.reviewUser.findMany({
        where: filterParam,
        orderBy: sortParam,
        skip: offset,
        take: limit,
      })
    ]);

    return new PaginationDto(res[0], res[1]);
  }
}
import { Injectable } from "@nestjs/common";
import { PaginationDto } from "../common/dto/pagination.dto";
import { SearchQueryDto } from "../common/pipes/search-query.pipe";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMatchingDto } from "./dto/create-matching.dto";
import { MatchingEntity } from "./entities/matching.entity";
import { MatchingType, Prisma } from "@prisma/client";

const defaultSelectedUserInfo = {
	id: true,
	name: true,
	avatar: true,
};

@Injectable()
export class MatchingRepository {
	constructor(private prisma: PrismaService) { }

	async create(ownerId: number, data: CreateMatchingDto): Promise<MatchingEntity> {
		// console.log(ownerId, data);
		return await this.prisma.matching.create({
			data: {
				...data,
				ownerId,
			}
		});
	}

	async list({ limit, offset }: SearchQueryDto, sortParam: object, filterParam: object): Promise<PaginationDto> {
		const res = await this.prisma.$transaction([
			this.prisma.matching.count({ where:  filterParam}),
			this.prisma.matching.findMany({
				where: filterParam,
				include: {
					owner: { select: defaultSelectedUserInfo },
					userMatchings: {
						select: {
							user: { select: defaultSelectedUserInfo }
						},
					}
				},
        orderBy: sortParam,
        skip: offset,
				take: limit,
			}),
		]);
		return new PaginationDto(res[0], res[1]);
	}

	async getMatchingsOfUser(id: number, { limit, offset }: SearchQueryDto, matchingFilter: object = {}): Promise<PaginationDto> {
		const res = await this.prisma.$transaction([
			this.prisma.userMatching.count({ where: { userId: id } }),
			this.prisma.userMatching.findMany({
				where: { 
          userId: id,
          matching: matchingFilter
        },
				include: {
					matching: {
						include: {
							userMatchings: {
								select: {
									user: { select: defaultSelectedUserInfo }
								}
							}
						}
					},
				},
				orderBy: { matching: { createdAt: 'desc' } },
				skip: offset,
				take: limit,
			}),
		])
		return new PaginationDto(res[0], res[1]);
	}
  
  async countMatching(condition: string) : Promise<number> {
    console.log(`
      SELECT COUNT(*) FROM matchings WHERE ${Prisma.sql`${Prisma.raw(condition)} = TRUE`};
    `);
    const res = await this.prisma.$queryRaw<number>`
      SELECT COUNT(*) FROM matchings WHERE ${Prisma.sql`${Prisma.raw(condition)} = TRUE`};
    `;
    return res[0]?.count || 0;
  }

	async findOne(id: number): Promise<MatchingEntity | null> {
		return await this.prisma.matching.findFirst({
			where: { id },
			include: { 
        owner: { select: defaultSelectedUserInfo },
        userMatchings: true,
      },
		})
	}

	async addUserToMatching(matchingId: number, userId: number) {
		await this.prisma.userMatching.create({
			data: { userId, matchingId }
		});
	}

	async removeUserFromMatching(matchingId: number, userId: number) {
		await this.prisma.userMatching.delete({
			where: { userId_matchingId: { matchingId, userId } }
		});
	}

	async delete(id: number): Promise<void> {
		await this.prisma.matching.delete({ where: { id } })
	}
}
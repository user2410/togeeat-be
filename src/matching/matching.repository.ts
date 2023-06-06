import { Injectable } from "@nestjs/common";
import { MatchingStatus } from "@prisma/client";
import { PaginationDto } from "../common/dto/pagination.dto";
import { SearchQueryDto } from "../common/pipes/search-query.pipe";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMatchingDto } from "./dto/create-matching.dto";
import { MatchingEntity } from "./entities/matching.entity";

@Injectable()
export class MatchingRepository {
	constructor(private prisma: PrismaService) { }

	async create(ownerId: number, data: CreateMatchingDto): Promise<MatchingEntity> {
		// console.log(ownerId, data);
		return this.prisma.matching.create({
			data: {
				...data,
				ownerId
			}
		});
	}

	async list({ limit, offset, rest }: SearchQueryDto, sortParam: object): Promise<PaginationDto> {
		const res = await this.prisma.$transaction([
			this.prisma.matching.count({ where: rest }),
			this.prisma.matching.findMany({
				where: rest,
				orderBy: sortParam,
				skip: offset,
				take: limit,
				include: {
					userMatchings: {
						include: {
							user: {
								select: {
									id: true,
									name: true,
									avatar: true,
								}
							}
						},
					}
				}
			}),
		]);
		return new PaginationDto(res[0], res[1]);
	}

	async getMatchingsOfUser(id: number, { limit, offset }: SearchQueryDto): Promise<PaginationDto> {
		const res = await this.prisma.$transaction([
			this.prisma.userMatching.count({ where: { userId: id } }),
			this.prisma.userMatching.findMany({
				where: { userId: id },
				include: {
					matching: {
						include: {
							userMatchings: {
								select: {
									user: {
										select: {
											id: true,
											name: true,
											avatar: true,
										}
									}
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

	async findOne(id: number): Promise<MatchingEntity | null> {
		return await this.prisma.matching.findFirst({
			where: { id },
			include: { userMatchings: true }
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

	async updateStatus(): Promise<void> {
		await this.prisma.matching.updateMany({
			where: {
				matchingDate: { lte: new Date() },
				status: MatchingStatus.OPEN,
			},
			data: { status: MatchingStatus.CLOSED }
		});
	}

	async delete(id: number): Promise<void> {
		await this.prisma.matching.delete({ where: { id } })
	}
}
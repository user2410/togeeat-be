import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateMatchingDto } from "./dto/create-matching.dto";
import { MatchingEntity } from "./entities/matching.entity";
import { PaginationDto } from "../common/dto/pagination.dto";
import { SearchQueryDto } from "../common/pipes/search-query.pipe";
import { MatchingStatus } from "@prisma/client";

@Injectable()
export class MatchingRepository {
	constructor(private prisma: PrismaService) { }

	async create(data: CreateMatchingDto): Promise<MatchingEntity> {
		return this.prisma.matching.create({ data });
	}

	async listActive({ limit, offset, sort, order }: SearchQueryDto): Promise<PaginationDto> {
		const sortParam = {};
		if (sort) {
			sortParam[sort] = order;
		}
		const res = await this.prisma.$transaction([
			this.prisma.matching.count({ where: { status: MatchingStatus.OPEN } }),
			this.prisma.matching.findMany({
				where: { status: MatchingStatus.OPEN },
				orderBy: sortParam,
				skip: offset ? offset : 10,
				take: limit ? limit : 10,
			}),
		]);
		return new PaginationDto(res[0], res[1]);
	}

	async findOne(id: number): Promise<MatchingEntity | null> {
		return await this.prisma.matching.findFirst({
			where: { id }
		})
	}

	async updateStatus(id: number): Promise<void> {
		await this.prisma.matching.update({
			where: { id },
			data: { status: MatchingStatus.CLOSED }
		})
	}

	async delete(id: number): Promise<void> {
		this.prisma.matching.delete({ where: { id } })
	}
}
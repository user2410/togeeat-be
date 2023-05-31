import { Test } from "@nestjs/testing";
import { Matching, MatchingStatus, MatchingType, PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from "../prisma/prisma.service";
import { MatchingRepository } from "./matching.repository";

describe('MatchingRepository', () => {
	let repository: MatchingRepository;
	let prismaService: DeepMockProxy<PrismaClient>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [MatchingRepository, PrismaService],
		})
			.overrideProvider(PrismaService)
			.useValue(mockDeep<PrismaClient>())
			.compile();

		repository = moduleRef.get(MatchingRepository);
		prismaService = moduleRef.get(PrismaService);
	});

	describe('create matching', () => {
		const data = {
			address: '',
			matchingDate: new Date(),
			matchingType: 'YOTEI' as MatchingType,
			desiredFood: '',
			conversationTopics: '',
		};

		const mockedMatching: Matching = {
			id: 1,
			status: 'OPEN',
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		};

		it('should create a new matching', async () => {
			prismaService.matching.create.mockResolvedValue(mockedMatching);

			await expect(repository.create(data)).resolves.toBe(mockedMatching);
		});

		// it('should update matching status', async () => {
		// 	prismaService.matching.create.mockResolvedValue(mockedMatching);
		// 	const newMatching = await repository.create(data);
		// 	expect(newMatching).toBe(mockedMatching);
		// 	expect(newMatching.status).toBe(MatchingStatus.OPEN);

		// 	await repository.updateStatus(newMatching.id);
		// 	const updatedMatching = await repository.findOne(newMatching.id);
		// 	expect(updatedMatching).toBeTruthy();
		// 	expect(updatedMatching?.status).toBe(MatchingStatus.OPEN);
		// });

	});
})
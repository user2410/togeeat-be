import { Test, TestingModule } from '@nestjs/testing';
import { MatchingService } from './matching.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Matching, MatchingStatus, MatchingType } from '@prisma/client';
import { MatchingRepository } from './matching.repository';

describe('MatchingService', () => {
  let service: MatchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchingService, PrismaService, MatchingRepository],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create matching', () => {
  //   it('should create a new matching', async () => {
  //     const data = {
  //       address: '',
  //       matchingDate: new Date(),
  //       matchingType: 'YOTEI' as MatchingType,
  //       desiredFood: '',
  //       conversationTopics: '',
  //     };

  //     const mockedMatching: Matching = {
  //       id: 1,
  //       status: 'OPEN',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       ...data,
  //     };

  //     prismaMock.matching.create.mockResolvedValue(mockedMatching);

  //     await expect(service.create(data)).resolves.toBe(mockedMatching);
  //   });

  //   it('should reject on invalid matching type', async () => {
  //     const data = {
  //       address: '',
  //       matchingDate: new Date(),
  //       matchingType: 'YOTE' as MatchingType,
  //       desiredFood: '',
  //       conversationTopics: '',
  //     };

  //     const mockedMatching = {
  //       id: 1,
  //       status: 'OPEN' as MatchingStatus,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       ...data,
  //     };

  //     prismaMock.matching.create.mockResolvedValue(mockedMatching);

  //     await expect(service.create(data)).rejects.toBeInstanceOf(Error);
  //   })
  // });
});

import { MatchingType, PrismaClient } from "@prisma/client";

export default async function seedMatchings(prisma: PrismaClient) {
	await prisma.matching.createMany({
		data: [
			{
				ownerId: 1,
				address: '123 Nguyen Van A Street, Ho Chi Minh City',
				matchingDate: new Date('2023-06-15T09:30:00'),
				desiredFood: 'Pho bo mam tom',
				conversationTopics: 'The Impact of Artificial Intelligence on Society',
				matchingType: MatchingType.QUICK,
			},
		]
	})
}
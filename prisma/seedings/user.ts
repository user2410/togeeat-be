import { hashPassword } from "@/common/utils/password";
import { MatchingType, PrismaClient } from "@prisma/client";

export default async function seedUsers(prisma: PrismaClient) {
	await prisma.account.createMany({
		data: [
			{
				email: 'user0@emai.com',
				password: await hashPassword('password'),
				isAdmin: true,
			}
		]
	});

	await prisma.userInformation.create({
		data: {
			name: 'Nguyen Van A',
			age: 20,
			address: 'So 1, Dai Co Viet, Hai Ba Trung, Ha Noi',
			description: 'Sinh vien nam 4 Dai Hoc Bach Khoa Ha Noi',
			avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
			phone: '+84012345678',
			backgroundImage: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
			nationality: 'Vietnam',
			languageSkills: 'Tieng Viet',
			accountId: 1,
		}
	})
}
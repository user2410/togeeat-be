import { hashPassword } from "../../src/common/utils/password";
import { PrismaClient } from "@prisma/client";

export default async function seedUsers(prisma: PrismaClient) {
  const password = await hashPassword('password')
	await prisma.account.createMany({
		data: [
			{
				email: 'khang@gmail.com',
				password: await hashPassword('password'),
				isAdmin: true,
			},
			{
				email: 'khang.td194591@sis.hust.edu.vn',
				password: await hashPassword('password'),
				isAdmin: true,
			},
			{
				email: 'ky@gmail.com',
				password: await hashPassword('password'),
				isAdmin: true,
			},
			{
				email: 'nguyenthithuy289midori@gmail.com',
				password: await hashPassword('password'),
				isAdmin: true,
			},
			{
				email: 'hoang@gmail.com',
				password: await hashPassword('password'),
				isAdmin: true,
			},
		]
	});

	await prisma.userInformation.createMany({
		data: [
			{
				name: 'Trịnh Đức Khang',
				age: 23,
				address: 'So 1, Dai Co Viet, Hai Ba Trung, Ha Noi',
				description: 'Sinh vien nam 4 Dai Hoc Bach Khoa Ha Noi',
				avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
				phone: '+862612659',
				backgroundImage: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
				nationality: 'vi',
				languageSkills: 'ja, vi',
        id: 1
			},
			{
				name: 'Trịnh Đức Khang',
				age: 23,
				address: 'So 1, Dai Co Viet, Hai Ba Trung, Ha Noi',
				description: 'Sinh vien nam 4 Dai Hoc Bach Khoa Ha Noi',
				avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
				phone: '+862612659',
				backgroundImage: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
				nationality: 'vi',
				languageSkills: 'ja, vi',
        id: 2
			},
			{
				name: 'Nguyen Van Ky',
				age: 23,
				address: 'So 1, Dai Co Viet, Hai Ba Trung, Ha Noi',
				description: 'Sinh vien nam 5 Dai Hoc Bach Khoa Ha Noi',
				avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
				phone: '+84012345679',
				backgroundImage: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
				nationality: 'vi',
				languageSkills: 'ja, vi, en',
				id: 3,
			},
			{
				name: 'Nguyễn Thị Thúy',
				age: 23,
				address: 'So 1, Dai Co Viet, Hai Ba Trung, Ha Noi',
				description: 'Sinh vien nam 5 Dai Hoc Bach Khoa Ha Noi',
				avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
				phone: '+84012345679',
				backgroundImage: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
				nationality: 'vi',
				languageSkills: 'ja, vi',
				id: 4,
			},
			{
				name: 'Hoang',
				age: 23,
				address: 'So 1, Dai Co Viet, Hai Ba Trung, Ha Noi',
				description: 'Sinh vien nam 5 Dai Hoc Bach Khoa Ha Noi',
				avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
				phone: '+84012345679',
				backgroundImage: 'https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg',
				nationality: 'vi',
				languageSkills: 'ja, en',
				id: 5,
			},
		]
	})
}
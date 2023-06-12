import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersRepository {
	constructor(private prisma: PrismaService) { }

	async create(accountId: number, data: CreateUserDto): Promise<UserEntity> {
		return await this.prisma.userInformation.create({
			data: {
				...data,
        id: accountId
			}
		});
	}

	async getById(id: number, includeAccount: boolean): Promise<UserEntity | null> {
		return await this.prisma.userInformation.findFirst({
			where: { id },
			include: { account: includeAccount }
		})
	}

	async update(id: number, data: UpdateUserDto) {
		return await this.prisma.userInformation.update({
			where: { id },
			data
		})
	}
}
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateAccountDto } from "./dto/create-account.dto";
import { AccountEntity } from "./entity/auth.entity";
import { defaultSelectedUserInfo } from "@/users/dto/default-selected-info";

@Injectable()
export class AuthRepository {
	constructor(private prisma: PrismaService) { }

	async create(data: CreateAccountDto) {
		return await this.prisma.account.create({ data });
	}

	async findByEmail(email: string): Promise<AccountEntity | null> {
		return await this.prisma.account.findFirst({ where: { email } });
	}

	async findById(id: number): Promise<AccountEntity | null> {
		return await this.prisma.account.findFirst({
			where: { id },
			include: { user: {
        select: defaultSelectedUserInfo
      } }
		});
	}

	async updatePassword(id: number, password: string): Promise<void> {
		await this.prisma.account.update({
			where: { id },
			data: { password }
		});
	}

	async updateRole(id: number, isAdmin: boolean): Promise<void> {
		await this.prisma.account.update({
			where: { id },
			data: { isAdmin }
		})
	}

	async updateBan(id: number, isBanned: boolean): Promise<void> {
		await this.prisma.account.update({
			where: { id },
			data: { isBanned }
		})
	}
}
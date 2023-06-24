import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginationDto } from "@/common/dto/pagination.dto";
import { SearchQueryDto } from "@/common/pipes/search-query.pipe";
import { Hobby } from "@prisma/client";

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

  async find({ limit, offset }: SearchQueryDto, sortParam: object, filterParam: object): Promise<PaginationDto>{
    // return await this.prisma.userInformation.findMany();
    const res = await this.prisma.$transaction([
      this.prisma.userInformation.count({where: filterParam}),
      this.prisma.userInformation.findMany({
        where: filterParam,
        include: {
          account: {
            select: {
              email: true,
            }
          },
          hobbies: true,
        },
        orderBy: sortParam,
        skip: offset,
				take: limit,
      })
    ]);
    return new PaginationDto(res[0], res[1]);
  }

	async getById(id: number, includeAccount: boolean): Promise<UserEntity | null> {
		return await this.prisma.userInformation.findFirst({
			where: { id },
			include: { 
        account: includeAccount,
        hobbies: true,
      }
		})
	}

	async update(id: number, data: UpdateUserDto) {
		return await this.prisma.userInformation.update({
			where: { id },
			data
		})
	}

  async createHobby(name: string): Promise<Hobby>{
    return this.prisma.hobby.create({
      data: {
        name
      }
    })
  }

  async getHobbies(): Promise<Hobby[]>{
    return this.prisma.hobby.findMany();
  }

  async assignHobby(userId: number, hobbyId: number): Promise<void> {
    await this.prisma.userHobby.create({
      data: {
        userId,
        hobbyId
      }
    });
  }
}
import { PaginationDto } from "@/common/dto/pagination.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { defaultSelectedUserInfo } from "@/users/dto/default-selected-info";
import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateGroupDto } from "./dto/create-room.dto";

@Injectable()
export class ChatRepository {
  constructor(private prisma: PrismaService) {}

  async createGroup(userId: number, data: CreateGroupDto){
    const newGroup = await this.prisma.group.create({
      data: {
        name: data.name,
        isGroup: data.members.filter(item => item !== userId).length > 1,
        users: {
          connect: [{id: userId}, ...data.members.map(id => ({id}))]
        }
      },
      include: {
        users: {
          select: defaultSelectedUserInfo
        }
      },
    });
    return newGroup;
  }

  async getGroups(userId: number, limit: number, offset: number) : Promise<PaginationDto> {
    const res = await this.prisma.$transaction([
      this.prisma.group.count({where: {users: {some: {id: userId}}}}),
      this.prisma.group.findMany({
        where: {users: {some: {id: userId}}},
        include: {
          users: {
            select: defaultSelectedUserInfo
          }
        },
        orderBy: {createdAt: 'desc'},
        skip: offset,
        take: limit,
      })
    ]);
    return new PaginationDto(res[0], res[1]);
  }

  async getGroup(id:string){
    return await this.prisma.group.findFirst({
      where: {id},
      include: {
        users: {
          select: defaultSelectedUserInfo
        },
      }
    })
  }

  async createMessage(userId: number, data: CreateMessageDto) {
    const newMessage = await this.prisma.message.create({
      data: {
        ...data,
        senderId: userId,
      },
      include: {
        sender: {
          select: defaultSelectedUserInfo
        }
      }
    });
    return newMessage;
  }

  async getMessages(groupId: string, limit: number, offset: number) : Promise<PaginationDto> {
    const res = await this.prisma.$transaction([
      this.prisma.message.count({where: {groupId}}),
      this.prisma.message.findMany({
        where: {groupId},
        include: {
          sender: {
            select: defaultSelectedUserInfo
          },
        },
        orderBy: {createdAt: 'desc'},
        skip: offset,
        take: limit,
      })
    ]);
    return new PaginationDto(res[0], res[1]);
  }

  async isUserInGroup(userId: number, groupId: string) : Promise<boolean> {
    return await this.prisma.group.count({
      where: {id: groupId, users: {some: {id: userId}}}
    }) > 0;
  }
}
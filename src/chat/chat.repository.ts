import { PaginationDto } from "@/common/dto/pagination.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { defaultSelectedUserInfo } from "@/users/dto/default-selected-info";
import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Group } from "@prisma/client";

@Injectable()
export class ChatRepository {
  constructor(private prisma: PrismaService) { }

  async createGroup(userId: number, data: CreateGroupDto) {
    const newGroup = await this.prisma.group.create({
      data: {
        name: data.name,
        ownerId: userId,
        isGroup: data.isGroup,
        usersGroups: {
          create: [
            {
              user: { connect: { id: userId } },
            },
            ...data.members.filter(item => item !== userId).map(item => ({
              user: { connect: { id: item } }
            })),
          ]
          // [
          //   {
          //     user: {
          //       connect: {id: userId}
          //     }
          //   }
          // ]
        }
      },
      include: {
        usersGroups: {
          select: {
            user: {
              select: defaultSelectedUserInfo
            }
          }
        }
      },
    });
    return newGroup;
  }

  async getGroups(userId: number, limit: number, offset: number): Promise<PaginationDto> {
    const res = await this.prisma.$transaction([
      this.prisma.group.count({ where: { usersGroups: { some: { userId } } } }),
      this.prisma.group.findMany({
        where: { usersGroups: { some: { userId } } },
        include: {
          usersGroups: {
            select: {
              user: {
                select: defaultSelectedUserInfo
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      })
    ]);
    return new PaginationDto(res[0], res[1]);
  }

  async searchGroup(filterParam: object) {
    const res = await this.prisma.$transaction([
      this.prisma.group.count({ where: filterParam }),
      this.prisma.group.findMany({ where: filterParam }),
    ]);
    return {
      count: res[0],
      items: res[1]
    }
  }

  async searchChat(userId1: number, userId2: number) {
    return await this.prisma.$queryRaw<Group[]>`
      SELECT g.*
      FROM groups as g
      WHERE 
      g.is_group='FALSE' AND
      (
        SELECT COUNT(*)
        FROM users_groups as ug
        WHERE ug.group_id = g.id
          AND ug.user_id IN (${userId1}, ${userId2})
      ) = 2;
    `;
  }

  async getGroup(id: string) {
    return await this.prisma.group.findFirst({
      where: { id },
      include: {
        usersGroups: {
          select: {
            user: {
              select: defaultSelectedUserInfo
            }
          }
        }
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

  async getMessages(groupId: string, limit: number, offset: number): Promise<PaginationDto> {
    const res = await this.prisma.$transaction([
      this.prisma.message.count({ where: { groupId } }),
      this.prisma.message.findMany({
        where: { groupId },
        include: {
          sender: {
            select: defaultSelectedUserInfo
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      })
    ]);
    return new PaginationDto(res[0], res[1]);
  }

  async isUserInGroup(userId: number, groupId: string): Promise<boolean> {
    return (await this.prisma.userGroup.count({
      where: {
        userId,
        groupId,
      }
    })) > 0;
  }

  async joinGroup(userId: number, groupId: string) {
    await this.prisma.userGroup.create({
      data: {
        groupId,
        userId
      }
    });
  }

  async leaveGroup(userId: number, groupId: string) {
    await this.prisma.userGroup.delete({
      where: {
        groupId_userId: {
          groupId,
          userId
        }
      }
    })
    // await this.prisma.group.update({
    //   where: {id: groupId},
    //   data: {
    //     users: {
    //       disconnect: [{id: userId}]
    //     }
    //   }
    // });
  }

  async updateGroup(groupId: string, data: UpdateGroupDto) {
    await this.prisma.group.update({
      where: { id: groupId },
      data,
    });
  }

  async deleteGroup(groupId: string) {
    await this.prisma.group.delete({
      where: { id: groupId }
    });
  }
}
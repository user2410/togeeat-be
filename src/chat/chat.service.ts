import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class ChatService {
  constructor(private repository: ChatRepository) {
  }

  async createGroup(userId: number, data: CreateGroupDto) {
    // check whether new group name is in format `matching_group_${number}`
    if (data.name && data.name.match(/^matching_group_\d+$/)) {
      const res = await this.searchGroup({
        name: data.name,
        isGroup: true,
        exact: true,
      });
      if(res.count > 0) {
        throw new ConflictException('Matching group already exists');
      }
      return await this.repository.createGroup(userId, data);
    }

    data.isGroup = data.members.filter(item => item !== userId).length > 1;
    if(!data.isGroup) {
      // search for group with only 2 members
      const res = await this.repository.searchChat(userId, data.members[0]);
      console.log(res);
      if(res.length > 0) {
        throw new ConflictException('Chat already exists');
      }
    }
    return await this.repository.createGroup(userId, data);
  }

  async getGroups(userId: number, limit: number, offset: number) {
    return await this.repository.getGroups(userId, limit, offset);
  }

  async searchGroup(data: {name?: string, isGroup?: boolean, ownerId?: number, exact: boolean}) {
    let nameFilter: any ;
    const {name, exact, ...rest} = data;
    if (name) {
      nameFilter = exact ? name : {contains: name, mode: 'insensitive'};
    }
    return await this.repository.searchGroup({
      name: nameFilter,
      ...rest,
    });
  }

  async getGroupDetails(id: string) {
    return await this.repository.getGroup(id);
  }

  async isUserInGroup(userId: number, groupId: string): Promise<boolean> {
    return await this.repository.isUserInGroup(userId, groupId);
  }

  async joinGroup(userId: number, groupId: string) {
    const group = await this.repository.getGroup(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (!group.isGroup) {
      throw new ConflictException('This is not a group');
    }
    await this.repository.joinGroup(userId, groupId);
  }

  async leaveGroup(userId: number, groupId: string) {
    const group = await this.repository.getGroup(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if(group.ownerId === userId){
      throw new ConflictException('You cannot leave the group you created');
    }

    await this.repository.leaveGroup(userId, groupId);
  }

  async updateGroup(groupId: string, data: UpdateGroupDto) {
    await this.repository.updateGroup(groupId, data);
  }

  async deleteGroup(groupId: string) {
    await this.repository.deleteGroup(groupId);
  }

  async createMessage(userId: number, data: CreateMessageDto) {
    const newMessage = await this.repository.createMessage(userId, data);
    await this.repository.updateGroup(data.groupId, { lastMessageAt: new Date() })
    return newMessage;
  }

  async getMessages(groupId: string, limit: number, offset: number) {
    return await this.repository.getMessages(groupId, limit, offset);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}

import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateGroupDto } from './dto/create-room.dto';

@Injectable()
export class ChatService{
  constructor(private repository: ChatRepository) {
  }

  async createGroup(userId: number, data: CreateGroupDto) {
    return await this.repository.createGroup(userId, data);
  }

  async getGroups(userId: number, limit: number, offset: number) {
    limit = limit > 0 ? limit : 100;
    offset = offset > 0 ? offset : 0;
    return await this.repository.getGroups(userId, limit, offset);
  }

  async getGroupDetails(id: string) {
    return await this.repository.getGroup(id);
  }

  async isUserInGroup(userId: number, groupId: string) : Promise<boolean> {
    console.log(userId, groupId);
    return await this.repository.isUserInGroup(userId, groupId);
  }

  async createMessage(userId: number, data: CreateMessageDto) {
    return await this.repository.createMessage(userId, data);
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

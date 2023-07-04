import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { PaginationDto } from "@/common/dto/pagination.dto";
import { ConflictException, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

@Controller('chats')
@ApiTags ('chats')
export class ChatController {
  constructor(private service : ChatService) {}

  private async getGroup(groupId: string) {
    const group = await this.service.getGroupDetails(groupId);
    if (!group) {
      throw new NotFoundException({ message: 'Group not found'});
    }
    return group;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new group chat' })
  @ApiCreatedResponse()
  async createGroup(@Request() req, data: CreateGroupDto) {
    const currentUserId = req.user.id;
    return await this.service.createGroup(currentUserId, data);
  }

  @Get('my-groups')
  @UseGuards(JwtAuthGuard)
  async getGroups(
    @Request() req, 
    @Query('limit') limit: number, @Query('offset') offset: number) : Promise<PaginationDto> {
    const currentUserId = req.user.id;
    return await this.service.getGroups(currentUserId, +limit, +offset);
  }

  @Get('group/:id/info')
  @UseGuards(JwtAuthGuard)
  async getGroupDetails(@Request() req, @Param('id', ParseUUIDPipe) groupId: string) {
    const currentUserId = req.user.id;
    // check whether currentUserId is in the group
    const isMember = await this.service.isUserInGroup(currentUserId, groupId);
    if (!isMember) {
      throw new ForbiddenException({ message: 'You are not a member of this group'});
    }
    return await this.service.getGroupDetails(groupId);
  }

  @Patch('/group/:id/join')
  @UseGuards(JwtAuthGuard)
  async joinGroup(@Request() req, @Param('id', ParseUUIDPipe) groupId: string) {
    const currentUserId = req.user.id;
    const isMember = await this.service.isUserInGroup(currentUserId, groupId);
    if (isMember) {
      throw new ConflictException({ message: 'You are already in this group'});
    }
    await this.service.joinGroup(currentUserId, groupId);
  }

  @Patch('/group/:id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveGroup(@Request() req, @Param('id', ParseUUIDPipe) groupId: string) {
    const currentUserId = req.user.id;
    const isMember = await this.service.isUserInGroup(currentUserId, groupId);
    if (!isMember) {
      throw new ConflictException({ message: 'You are not in this group'});
    }
    await this.service.leaveGroup(currentUserId, groupId);
  }

  @Get('group/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getChats(
    @Request() req, 
    @Param('id', ParseUUIDPipe) groupId: string, 
    @Query('limit') limit: number, @Query('offset') offset: number) : Promise<PaginationDto> {
    const currentUserId = req.user.id;
    // check whether currentUserId is in the group
    const isMember = await this.service.isUserInGroup(currentUserId, groupId);
    if (!isMember) {
      throw new ForbiddenException({ message: 'You are not a member of this group'});
    }
    
    return await this.service.getMessages(groupId, +limit, +offset);
  }

  @Patch('group/:id')
  @UseGuards(JwtAuthGuard)
  async updateGroup(@Request() req, @Param('id', ParseUUIDPipe) groupId: string, data: UpdateGroupDto) {
    const currentUserId = req.user.id;
    // check group existence
    const group = await this.getGroup(groupId);
    // check whether currentUserId is owner the group
    if (group.ownerId !== currentUserId) {
      throw new ForbiddenException({ message: 'You are not the owner of this group'});
    }
    delete data['lastMessageAt'];
    return await this.service.updateGroup(groupId, data);
  }

  @Delete('group/:id')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Request() req, @Param('id', ParseUUIDPipe) groupId: string) {
    const currentUserId = req.user.id;
    // check group existence
    const group = await this.getGroup(groupId);
    // check whether currentUserId is owner the group
    if (group.ownerId !== currentUserId) {
      throw new ForbiddenException({ message: 'You are not the owner of this group'});
    }
    return await this.service.deleteGroup(groupId);
  }
}
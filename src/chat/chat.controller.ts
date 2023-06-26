import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { PaginationDto } from "@/common/dto/pagination.dto";
import { Controller, ForbiddenException, Get, Param, Query, Request, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChatService } from "./chat.service";

@Controller('chats')
@ApiTags ('chats')
export class ChatController {
  constructor(private service : ChatService) {}

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
  async getGroupDetails(@Request() req, @Param('id') groupId: string) {
    const currentUserId = req.user.id;
    // check whether currentUserId is in the group
    const isMember = await this.service.isUserInGroup(currentUserId, groupId);
    if (!isMember) {
      throw new ForbiddenException({ message: 'You are not a member of this group'});
    }
    return await this.service.getGroupDetails(groupId);
  }

  @Get('group/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getChats(
    @Request() req, 
    @Param('id') groupId: string, 
    @Query('limit') limit: number, @Query('offset') offset: number) : Promise<PaginationDto> {
    const currentUserId = req.user.id;
    // check whether currentUserId is in the group
    console.log(currentUserId, groupId);
    const isMember = await this.service.isUserInGroup(currentUserId, groupId);
    if (!isMember) {
      throw new ForbiddenException({ message: 'You are not a member of this group'});
    }
    
    return await this.service.getMessages(groupId, +limit, +offset);
  }
}
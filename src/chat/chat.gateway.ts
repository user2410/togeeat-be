import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateGroupDto } from './dto/create-room.dto';
import { SocketWithAuth } from './types';

// ws-room name = group id
@WebSocketGateway({
  namespace: 'chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  private ns: Namespace;

  private readonly logger = new Logger(ChatGateway.name);
  private mapUserIdToSocketId = new Map<number, string>();

  constructor(private readonly service: ChatService) {}
  
  afterInit() : void {
    this.logger.log('WS Initialized!');
  }

  handleConnection(@ConnectedSocket() socket: SocketWithAuth) {
    const sockets = this.ns.sockets;
    this.logger.debug(
      `Socket connected with userID: ${socket.userID}`,
    );

    // add to map
    this.mapUserIdToSocketId.set(socket.userID, socket.id);

    this.logger.log(`WS Client with id: ${socket.id} connected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  handleDisconnect(@ConnectedSocket() socket: SocketWithAuth) {
    const sockets = this.ns.sockets;

    // remove from map
    this.mapUserIdToSocketId.delete(socket.userID);

    this.logger.debug(
      `Socket with userID: ${socket.userID} disconnected`,
    );

    this.logger.log(`WS Client with id: ${socket.id} disconnected!`);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  }

  @SubscribeMessage('getGroups')
  async getGroups(@MessageBody() {limit, offset}: {limit: number, offset: number}, @ConnectedSocket() socket: SocketWithAuth) {
    limit = limit || 100;
    offset = offset || 0;
    const res = await this.service.getGroups(socket.userID, +limit, +offset);

    // join current socket to ws-rooms
    for(const {id} of res.items) {
      console.log(id);
      socket.join(id);
    }

    return res;
  }

  @SubscribeMessage('createGroup')
  async createRoom(@MessageBody() data: CreateGroupDto, @ConnectedSocket() socket: SocketWithAuth) {
    this.logger.log(`WS Client with id: ${socket.id}`);

    // create group in db
    const newGroup = await this.service.createGroup(socket.userID, data);

    // join current user to ws-room
    socket.join(newGroup.id);
    for(const userId of data.members) {
      // get socket id of member
      const socketId = this.mapUserIdToSocketId.get(userId);
      if(socketId) {
        // join member to ws-room
        this.ns.sockets.get(socketId)?.join(newGroup.id);
      }
      // emit event create room to all users in ws-room
      this.ns.to(newGroup.id).emit('createGroup', newGroup);
    }

    return newGroup;
  }

  @SubscribeMessage('joinWsRoom')
  async joinWsRoom(@MessageBody() data: {groupIds: string[]}, @ConnectedSocket() socket: SocketWithAuth) {
    // check whether current user is in group
    for(const groupId of data.groupIds) {
      if(!(await this.service.isUserInGroup(socket.userID, groupId))) {
        throw new WsException('You are not in this group');
      }
      socket.join(groupId);
    }
  }

  // @SubscribeMessage('joinGroup')
  // async joinGroup() {
  //   // join group in db
  //   // join ws-room
  // }

  @SubscribeMessage('createMessage')
  async createMessage(@MessageBody() data: CreateMessageDto, @ConnectedSocket() socket: SocketWithAuth) {
    console.log(data);
    this.logger.log(`WS Client with id: ${socket.id}`);

    // check whether current socket is in ws-room with id=data.groupId
    if(!socket.rooms.has(data.groupId)) {
      throw new WsException('You are not in this group');
    }

    // create message in db
    const newMessage = await this.service.createMessage(socket.userID, data);

    // emit event create message to all users in ws-room
    this.ns.to(data.groupId).emit('createMessage', newMessage);

    return newMessage;
  }

  // @SubscribeMessage('findAllMessages')
  // findAll() {
  //   return this.messagesService.findAll();
  // }

  // @SubscribeMessage('joinRoom')
  // joinRoom(@MessageBody() room: string) {

  // }

  // @SubscribeMessage('typing')
  // async typing(){
    
  // }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}

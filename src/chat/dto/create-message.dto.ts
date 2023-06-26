import { MessageType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
  
  @IsEnum(['TEXT', 'IMAGE'])
  @IsNotEmpty()
  contentType: MessageType;
}

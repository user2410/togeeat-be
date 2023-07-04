import { IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateGroupDto {
  
  @IsString()
  name?: string;

  @IsDate()
  lastMessageAt?: Date;
}

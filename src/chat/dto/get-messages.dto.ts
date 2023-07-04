import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class GetMessagesDto {
  @IsNotEmpty()
  @IsUUID()
  groupId: string;
  
  @IsNumber()
  @Min(0)
  limit?: number = 100;
  
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
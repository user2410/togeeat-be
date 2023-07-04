import { IsNumber, Min } from "class-validator";

export class GetGroupsDto {
  @IsNumber()
  @Min(0)
  limit?: number = 100;
  
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
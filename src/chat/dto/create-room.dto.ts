import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateGroupDto{
  @IsString()
  name?: string = `Group_${Date.now()}`;

  @IsBoolean()
  isGroup?: boolean = false;

  @IsNumber({}, {each: true})
  members: number[];
}
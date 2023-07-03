import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateGroupDto{
  @IsString()
  name?: string = `Group_${Date.now()}`;

  @IsNumber({}, {each: true})
  members: number[];
}
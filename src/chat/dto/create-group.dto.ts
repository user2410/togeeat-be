import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateGroupDto{
  @IsString()
  name?: string = `Group_${Date.now()}`;

  @IsBoolean()
  isGroup?: boolean = true;

  @IsNumber({}, {each: true})
  @IsNotEmpty()
  members: number[];
}
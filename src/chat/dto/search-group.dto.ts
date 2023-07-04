import { IsBoolean, IsString } from "class-validator";

export class SearchGroupParam {
  @IsString()
  name?: string;

  @IsBoolean()
  isGroup?: boolean;

  @IsBoolean()
  ownerId?: number;
  
  @IsBoolean()
  exact?: boolean = false;
}
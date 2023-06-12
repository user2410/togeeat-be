import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUrl } from "class-validator"

export class UserEntity {
	@ApiProperty()
	id: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNumber()
  @IsNotEmpty()
	age: number;

	@ApiProperty()
	@IsString()
	description?: string;

	@ApiProperty()
	@IsUrl()
	avatar?: string;

	@ApiProperty()
	@IsPhoneNumber()
  @IsNotEmpty()
	phone: string;

	@ApiProperty()
	@IsUrl()
	backgroundImage?: string;

	@ApiProperty()
	@IsString()
  @IsNotEmpty()
	address: string;

	@ApiProperty()
	@IsString()
  @IsNotEmpty()
	nationality: string;

	@ApiProperty()
	@IsString()
	languageSkills?: string;

	@ApiProperty()
	@IsBoolean()
	isPublic?: boolean = false;
}
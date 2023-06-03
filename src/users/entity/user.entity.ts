import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUrl } from "class-validator"

export class UserEntity {
	@ApiProperty()
	id: number;

	@ApiProperty()
	@IsNumber()
	@IsNotEmpty()
	accountId: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNumber()
	age: number;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsUrl()
	avatar: string;

	@ApiProperty()
	@IsPhoneNumber()
	phone: string;

	@ApiProperty()
	@IsUrl()
	backgroundImage?: string;

	@ApiProperty()
	@IsString()
	address: string;

	@ApiProperty()
	@IsString()
	nationality: string;

	@ApiProperty()
	@IsString()
	languageSkills?: string;

	@ApiProperty()
	@IsBoolean()
	isPublic?: boolean = false;
}
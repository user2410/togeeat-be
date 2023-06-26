import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AccountEntity {
	@ApiProperty()
	id: number;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsBoolean()
	isAdmin: boolean;

	@ApiProperty()
	@IsBoolean()
	isBanned: boolean;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
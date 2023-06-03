import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AccountEntity {
	@ApiProperty()
	id: number;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty()
	@IsBoolean()
	isAdmin?: boolean = false;

	@ApiProperty()
	@IsBoolean()
	isBanned?: boolean = false;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
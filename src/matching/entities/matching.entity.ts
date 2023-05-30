import { ApiProperty } from "@nestjs/swagger";
import { MatchingStatus, MatchingType } from "@prisma/client";
import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class MatchingEntity {
	@ApiProperty()
	id: number;

	@ApiProperty({
		description: 'possible values: OPEN, CLOSED',
		example: 'OPEN',
	})
	@IsString() @IsEnum(MatchingStatus)
	status: MatchingStatus;

	@ApiProperty()
	@IsString()
	address: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDate()
	matchingDate: Date;

	@ApiProperty()
	@IsString()
	desiredFood: string;

	@ApiProperty()
	@IsString()
	conversationTopics: string;

	@ApiProperty({
		description: 'possible values: QUICK, YOTEI',
		example: 'QUICK',
	})
	@IsString() @IsEnum(MatchingType)
	matchingType: MatchingType;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

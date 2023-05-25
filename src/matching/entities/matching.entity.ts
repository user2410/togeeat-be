import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class MatchingEntity {
	@ApiProperty()
	id: number;

	@ApiProperty({
		description: 'false: open (default), true: close',
	})
	status: boolean;

	@ApiProperty()
	@IsString()
	address: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDateString()
	@IsDate()
	matchingDate: Date;

	@ApiProperty()
	@IsString()
	desiredFood: string;

	@ApiProperty()
	@IsString()
	conversationTopics: string;

	@ApiProperty()
	@IsBoolean()
	matchingType: boolean;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

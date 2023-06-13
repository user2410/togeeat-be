import { ApiProperty } from "@nestjs/swagger";
import { MatchingType, UserMatching } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class MatchingEntity {
	@ApiProperty()
	id: number;

	@ApiProperty()
	@IsNotEmpty()
	ownerId: number;

	@ApiProperty()
	@IsString()
	address: string;
  
	@ApiProperty()
  @IsOptional()
  @Min(15)
  @Max(120)
  @Type(() => Number)
  duration?: number | null;
  
	@ApiProperty()
  @IsOptional()
	@IsDate()
  @Type(() => Date)
	matchingDate?: Date | null;

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

	userMatchings?: UserMatching[]
}

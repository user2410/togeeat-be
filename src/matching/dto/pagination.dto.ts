import { ApiProperty } from "@nestjs/swagger";
import { MatchingEntity } from "../entities/matching.entity";

export class MatchingPaginationDto {

	@ApiProperty({
		description: 'Total count of available items',
		example: 1,
	})
	count: number;

	@ApiProperty({
		type: [MatchingEntity],
		description: 'List of pagination'
	})
	items: MatchingEntity[];
}
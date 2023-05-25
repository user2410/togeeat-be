import { OmitType } from "@nestjs/swagger";
import { MatchingEntity } from "../entities/matching.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMatchingDto extends OmitType(MatchingEntity, ['id', 'updatedAt', 'createdAt']) {
}

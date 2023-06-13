import { OmitType } from "@nestjs/swagger";
import { MatchingEntity } from "../entities/matching.entity";

export class CreateMatchingDto extends OmitType(MatchingEntity, ['id', 'ownerId', 'updatedAt', 'createdAt', 'userMatchings']) {
}

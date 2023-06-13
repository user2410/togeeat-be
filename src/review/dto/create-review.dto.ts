import { OmitType, PickType } from "@nestjs/swagger";
import { ReviewEntity } from "../entities/review.entity";

export class CreateReviewDto extends OmitType(ReviewEntity, ['id', 'user1Id', 'updatedAt', 'createdAt']) {}
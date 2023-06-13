import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ReviewEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  user1Id: number;
  
  @ApiProperty()
  @IsNotEmpty()
  user2Id: number;
  
  @ApiProperty()
  @IsOptional()
  parentCommentId?: number | null;
  
  @ApiProperty()
  @IsNotEmpty()
  content: string;
  
  @ApiProperty()
  @IsNotEmpty()
  star: number;
  
  @ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
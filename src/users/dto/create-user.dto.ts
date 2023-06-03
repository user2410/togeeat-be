import { OmitType } from "@nestjs/swagger";
import { UserEntity } from "../entity/user.entity";

export class CreateUserDto extends OmitType(UserEntity, ['id']) { }
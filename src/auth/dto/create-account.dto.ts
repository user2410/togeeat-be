import { OmitType } from "@nestjs/swagger";
import { AccountEntity } from "../entity/auth.entity";

export class CreateAccountDto extends OmitType(AccountEntity, ['id', 'isAdmin', 'isBanned', 'createdAt', 'updatedAt']) { }
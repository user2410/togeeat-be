import { OmitType, PickType } from "@nestjs/swagger";
import { AccountEntity } from "../entity/auth.entity";

export class CreateAccountDto extends PickType(AccountEntity, ['email', 'password']) { }
import { OmitType, PickType } from "@nestjs/swagger";
import { AccountEntity } from "../entity/auth.entity";

export class ResAccountDto extends OmitType(AccountEntity, ['password']) { }
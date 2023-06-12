import { UserEntity } from "@/users/entity/user.entity";
import { OmitType } from "@nestjs/swagger";
import { AccountEntity } from "../entity/auth.entity";

export class AccountWithoutPasswordDto extends OmitType(AccountEntity, ['password']) { }

export type ResAccountDto = { 
  account: AccountWithoutPasswordDto & { user: UserEntity } };
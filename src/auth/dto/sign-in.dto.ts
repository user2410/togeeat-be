import { PickType } from "@nestjs/swagger";
import { AccountEntity } from "../entity/auth.entity";

export class SignInDto extends PickType(AccountEntity, ['email', 'password']) { }
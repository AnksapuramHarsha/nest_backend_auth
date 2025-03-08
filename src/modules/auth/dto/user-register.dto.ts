import {
  EmailField,
  PasswordField,
  PhoneFieldOptional,
  StringField,
  EnumField
} from '../../../decorators/field.decorators.ts';
import { RoleType } from '../../../constants/role-type.ts';


export class UserRegisterDto {
  @StringField()
  readonly firstName!: string;

  @StringField()
  readonly lastName!: string;

  @EmailField()
  readonly email!: string;

  @PasswordField({ minLength: 6 })
  readonly password!: string;

  @PhoneFieldOptional()
  phone?: string;

  @EnumField(() => RoleType)
  readonly role!: RoleType;
}

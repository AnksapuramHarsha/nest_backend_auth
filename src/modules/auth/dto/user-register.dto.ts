import {
  EmailField,
  PasswordField,
  StringField,
  EnumField,
  UUIDField
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

  
  phone?: string;

  @EnumField(() => RoleType)
  readonly role!: RoleType;

  @UUIDField()
  readonly organizationId!: string;

  @UUIDField()
  readonly networkId!: string;
}

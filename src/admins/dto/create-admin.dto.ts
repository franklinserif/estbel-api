import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';

export class CreateAdminDto {
  @IsString()
  @IsUUIDOrCI()
  id: string;

  @IsString()
  @MinLength(6, { message: 'password must have at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must have at least 1 number and 1 character',
  })
  password: string;

  @IsEmail()
  email: string;
}

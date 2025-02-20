import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsUUIDOrCI()
  id: string;

  @IsString()
  @MinLength(6, { message: 'password must have at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must have at least 1 number and 1 character',
  })
  password: string;

  @IsEmail()
  email: string;
}

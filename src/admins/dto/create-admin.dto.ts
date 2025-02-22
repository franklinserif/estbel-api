import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';
import { IsEmail, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsUUIDOrCI()
  id: string;

  @IsEmail()
  email: string;
}

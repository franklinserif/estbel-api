import { PartialType } from '@nestjs/mapped-types';
import { IsString, Matches, MinLength } from 'class-validator';
import { CreateAdminDto } from '@admins/dto/create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsString()
  @MinLength(6, { message: 'password must have at least 6 characters' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must have at least 1 number and 1 character',
  })
  password: string;
}

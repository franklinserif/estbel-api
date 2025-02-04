import { PartialType } from '@nestjs/mapped-types';
import { IsString, Matches, MinLength } from 'class-validator';
import { CreateAdminDto } from '@admins/dto/create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 6 characters long.',
  })
  password: string;
}

import { IsString, MinLength, IsUUID, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}

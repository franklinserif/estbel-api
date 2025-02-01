import { IsEmail, IsString, IsUrl, Matches, MinLength } from 'class-validator';

export class AccountCreatedDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsUrl()
  activationLink: string;

  @IsString()
  @MinLength(6, { message: 'The password must have at least 6 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'The password must have at least one simbol, one uppercase, one lowercase and one number',
    },
  )
  password: string;
}

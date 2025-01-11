import { IsOptional, IsString, Length } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @Length(2)
  name: string;

  @IsOptional()
  @IsString()
  @Length(2)
  location: string;
}

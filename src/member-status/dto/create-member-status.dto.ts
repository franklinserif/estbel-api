import { IsString, MinLength } from 'class-validator';

export class CreateMemberStatusDto {
  @IsString()
  @MinLength(2)
  name: string;
}

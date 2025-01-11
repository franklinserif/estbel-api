import { IsString, Length } from 'class-validator';

export class CreateMemberStatusDto {
  @IsString()
  @Length(2)
  name: string;
}

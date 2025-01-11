import { IsString } from 'class-validator';

export class CreateMemberStatusDto {
  @IsString()
  name: string;
}

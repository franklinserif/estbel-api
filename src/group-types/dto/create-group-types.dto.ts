import { IsString, Length } from 'class-validator';

export class CreateGroupTypesDto {
  @IsString()
  @Length(2)
  name: string;
}

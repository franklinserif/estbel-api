import { IsString, MinLength } from 'class-validator';

export class CreateGroupTypesDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(8)
  description: string;
}

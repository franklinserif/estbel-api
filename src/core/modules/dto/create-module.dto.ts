import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateModuleDto {
  @IsUUID()
  id: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  description: string;
}

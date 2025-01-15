import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  location: string;

  @IsUUID()
  @IsString()
  groupTypeId: string;
}

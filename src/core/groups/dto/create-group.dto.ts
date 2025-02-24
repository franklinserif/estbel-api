import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  location: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  description: string;

  @IsUUID()
  @IsString()
  groupTypeId: string;
}

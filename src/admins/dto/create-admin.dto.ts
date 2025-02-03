import { IsString, IsUUID } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsUUID()
  id: string;
}

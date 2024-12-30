import { IsString } from 'class-validator';

export class CreateFieldDto {
  @IsString()
  fieldName: string;

  @IsString()
  fieldType: string;
}

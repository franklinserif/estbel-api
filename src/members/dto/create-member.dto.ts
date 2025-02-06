import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsEmail,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { CivilStatus, Gender } from '@members/enum/options';
import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';

export class CreateMemberDto {
  @IsOptional()
  @MinLength(5)
  @IsString()
  id?: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  @MinLength(5)
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsEmail()
  @MinLength(4)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  location?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  zone?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  address?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  howTheyArrived?: string;

  @IsBoolean()
  @IsOptional()
  isBaptized: boolean;

  @IsOptional()
  @IsDateString()
  baptizedAt?: Date;

  @IsOptional()
  @IsString()
  @MinLength(2)
  baptizedChurch?: string;

  @IsEnum(CivilStatus)
  civilStatus: CivilStatus;

  @IsOptional()
  @IsDateString()
  weddingAt?: Date;

  @IsDateString()
  firstVisitAt: Date;

  @IsUUID()
  @IsString()
  memberStatusId: string;

  @IsOptional()
  @IsUUIDOrCI()
  spouseId?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUIDOrCI({ each: true })
  parentIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUIDOrCI({ each: true })
  childIds?: string[];
}

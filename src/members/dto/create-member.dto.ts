import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Gender } from '@members/enum/options';

export class CreateMemberDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  ci?: string;

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
  municipality?: string;

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
  isBaptized: boolean;

  @IsOptional()
  @IsDateString()
  baptizedAt?: Date;

  @IsOptional()
  @IsString()
  @MinLength(2)
  baptizedChurch?: string;

  @IsBoolean()
  civilStatus: boolean;

  @IsOptional()
  @IsDateString()
  weddingAt?: Date;

  @IsDateString()
  firstVisitAt: Date;
}

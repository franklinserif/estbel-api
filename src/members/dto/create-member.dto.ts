import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { Gender } from '@members/enum/options';

export class CreateMemberDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @IsString()
  parish?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  howTheyArrived?: string;

  @IsBoolean()
  isBaptized: boolean;

  @IsOptional()
  @IsDateString()
  baptizedAt?: Date;

  @IsOptional()
  @IsString()
  baptizedChurch?: string;

  @IsBoolean()
  civilStatus: boolean;

  @IsOptional()
  @IsDateString()
  weddingAt?: Date;

  @IsDateString()
  firstVisitAt: Date;
}

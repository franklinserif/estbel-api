import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';
import { IsArray } from 'class-validator';

export class idsDto {
  @IsArray()
  @IsUUIDOrCI({ each: true })
  ids: string[];
}

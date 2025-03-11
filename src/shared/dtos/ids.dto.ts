import { IsArray } from 'class-validator';
import { IsUUIDOrCI } from '@members/decorators/is-uuidor-ci.decorator';

export class idsDto {
  @IsArray()
  @IsUUIDOrCI({ each: true })
  ids: string[];
}

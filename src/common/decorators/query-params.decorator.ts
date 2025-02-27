/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable security/detect-object-injection */
import { isEntity } from '@shared/libs/isTypeOrmEntity';
import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Like, MoreThan, LessThan, getMetadataArgsStorage } from 'typeorm';

export const QueryParams = createParamDecorator(
  (entity: any, ctx: ExecutionContext) => {
    if (!isEntity(entity)) {
      throw new BadRequestException(
        'class must be an typeorm entity for validate QueryParams',
      );
    }

    const entityFields = getMetadataArgsStorage()
      .columns.filter((col) => col.target === entity)
      .map((col) => col.propertyName);

    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const where: Record<string, any> = {};
    const order: Record<string, 'ASC' | 'DESC'> = {};

    Object.keys(query).forEach((key) => {
      const value = query[key];

      const fieldName = key.replace(/(_like|_gt|_lt)$/, '');

      if (!entityFields.includes(fieldName)) {
        throw new BadRequestException(
          `The field '${fieldName}' doesn't exist on entity`,
        );
      }

      if (key === 'orderBy') {
        const [column, direction] = value.split(':');
        if (['ASC', 'DESC'].includes(direction.toUpperCase())) {
          order[column] = direction.toUpperCase() as 'ASC' | 'DESC';
        }
      } else if (key.endsWith('_like')) {
        where[fieldName] = Like(`%${value}%`);
      } else if (key.endsWith('_gt')) {
        where[fieldName] = MoreThan(value);
      } else if (key.endsWith('_lt')) {
        where[fieldName] = LessThan(value);
      } else if (value === 'true' || value === 'false') {
        where[fieldName] = value === 'true';
      } else {
        where[fieldName] = value;
      }
    });

    return { where, order };
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Like, MoreThan, LessThan } from 'typeorm';

export const QueryParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const where: Record<string, any> = {};
    const order: Record<string, 'ASC' | 'DESC'> = {};

    Object.keys(query).forEach((key) => {
      const value = query[key];

      if (key === 'orderBy') {
        const [column, direction] = value.split(':');
        if (['ASC', 'DESC'].includes(direction.toUpperCase())) {
          order[column] = direction.toUpperCase() as 'ASC' | 'DESC';
        }
      } else if (key.endsWith('_like')) {
        const column = key.replace('_like', '');
        where[column] = Like(`%${value}%`);
      } else if (key.endsWith('_gt')) {
        const column = key.replace('_gt', '');
        where[column] = MoreThan(value);
      } else if (key.endsWith('_lt')) {
        const column = key.replace('_lt', '');
        where[column] = LessThan(value);
      } else {
        where[key] = value;
      }
    });

    return { where, order };
  },
);

export interface IQueryParams {
  where: Record<string, any>;
  order: Record<string, 'ASC' | 'DESC'>;
}

import { getMetadataArgsStorage } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isEntity(target: Function): boolean {
  return getMetadataArgsStorage().tables.some(
    (table) => table.target === target,
  );
}

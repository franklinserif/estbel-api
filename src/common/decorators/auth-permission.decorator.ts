// module-permission.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const MODULE_PERMISSION_KEY = 'modulePermission';
export type PermissionType = 'read' | 'create' | 'edit' | 'delete' | 'print';

export const AuthPermission = (moduleId: string, permission: PermissionType) =>
  SetMetadata(MODULE_PERMISSION_KEY, { moduleId, permission });

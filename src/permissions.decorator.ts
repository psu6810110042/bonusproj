import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export type PermissionType = 'read' | 'write';

export const RequirePermission = (permission: PermissionType) =>
  SetMetadata(PERMISSIONS_KEY, permission);

import { GlobalPermissionEnum, StorePermissionEnum } from "@/enums/permission";

export type PermissionContext = {
  userId: number;
  employeeId?: number;
  storeId?: string;
  storeSlug?: string;
  globalPermissions: Set<string>;
  storePermissions: Set<string>;
};

export function globalCan(
  ctx: PermissionContext,
  permission: GlobalPermissionEnum,
) {
  return ctx.globalPermissions.has(permission);
}

export function assertGlobalCan(
  ctx: PermissionContext,
  permission: GlobalPermissionEnum,
) {
  if (!globalCan(ctx, permission)) {
    throw new Error("Forbidden");
  }
}

export function storeCan(
  ctx: PermissionContext,
  permission: StorePermissionEnum,
) {
  return ctx.storePermissions.has(permission);
}

export function assertStoreCan(
  ctx: PermissionContext,
  permission: StorePermissionEnum,
) {
  assertStore(ctx);

  if (!storeCan(ctx, permission)) {
    throw new Error("Forbidden");
  }
}

/**
 * Validates that the user has access to the store.
 * @param ctx The permission context.
 */
export function assertStore(ctx: PermissionContext) {
  if (!ctx.employeeId || !ctx.storeId) {
    throw new Error("Unauthorized");
  }
}

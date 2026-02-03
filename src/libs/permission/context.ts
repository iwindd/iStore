import { GlobalPermissionEnum, StorePermissionEnum } from "@/enums/permission";
import { forbidden, unauthorized } from "next/navigation";

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
    forbidden();
  }
}

function storeCan(ctx: PermissionContext, permission: StorePermissionEnum) {
  return ctx.storePermissions.has(permission);
}

export function assertStoreCan(
  ctx: PermissionContext,
  permission: StorePermissionEnum | StorePermissionEnum[],
  options?: {
    some?: boolean;
    throw?: boolean;
  },
) {
  assertStore(ctx);

  // GLOBAL BYPASS
  if (globalCan(ctx, GlobalPermissionEnum.STORE_MANAGEMENT)) {
    return true;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  options = options ?? {};
  options.some = options.some ?? false;

  // SOME CASE
  if (permissions.some((p) => storeCan(ctx, p) && options.some)) {
    return true;
  }

  // EVERY CASE
  if (permissions.every((p) => storeCan(ctx, p) && !options?.some)) {
    return true;
  }

  return options.throw ? false : forbidden();
}

/**
 * Validates that the user has access to the store.
 * @param ctx The permission context.
 */
export function assertStore(ctx: PermissionContext) {
  if (!ctx.employeeId || !ctx.storeId) {
    unauthorized();
  }
}

export function ifNotHasStorePermission<T = number, U = undefined>(
  ctx: PermissionContext,
  permission: StorePermissionEnum,
  has?: T,
  notHas?: U,
) {
  assertStore(ctx);

  if (globalCan(ctx, GlobalPermissionEnum.STORE_MANAGEMENT)) {
    return notHas;
  }

  if (ctx.storePermissions.has(permission)) {
    return has ?? ctx.employeeId!;
  }

  return notHas;
}

export function getStoreUnstableCacheKey(ctx: PermissionContext) {
  return [
    ctx.storeId!,
    ctx.employeeId!.toString(),
    Array.from(ctx.storePermissions).join(","),
  ];
}

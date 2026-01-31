"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { removeWhiteSpace } from "@/libs/formatter";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

const findProductToCreate = async (storeSlug: string, serial: string) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, PermissionConfig.store.product.find);

    const product = await db.product.findFirst({
      where: {
        serial: removeWhiteSpace(serial),
        store_id: ctx.storeId!,
      },
    });

    return {
      success: true,
      data: product && {
        ...product,
        price: product.price.toNumber(),
        cost: product.cost.toNumber(),
      },
    };
  } catch (error) {
    console.error("findProductToCreate error:", error);
    return {
      success: false,
    };
  }
};

export default findProductToCreate;

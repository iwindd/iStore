"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import {
  ProductUpdateKeywordsSchema,
  ProductUpdateKeywordsValues,
} from "@/schema/Product";

const updateProductKeywords = async (
  storeSlug: string,
  payload: ProductUpdateKeywordsValues & { id: number },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.product.update);
  const validated = ProductUpdateKeywordsSchema.parse(payload);
  const keywords = validated.keywords.map((k) => k.value);

  await db.product.update({
    where: {
      id: payload.id,
      store_id: ctx.storeId!,
    },
    data: {
      keywords: JSON.stringify(keywords),
    },
    select: {
      keywords: true,
    },
  });

  return {
    keywords,
  };
};

export default updateProductKeywords;

"use server";
import { ProductPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Product } from "@prisma/client";
import { getFilterRange } from "./range";

const getProducts = async (store: number): Promise<Product[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return await db.product.findMany({
      where: {
        store_id: store,
        user_store_id: !user.hasPermission(ProductPermissionEnum.READ)
          ? user.userStoreId
          : undefined,
        ...(await getFilterRange()),
        deleted_at: null,
      },
    });
  } catch (error) {
    return [];
  }
};

export default getProducts;

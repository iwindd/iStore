"use server";
import { Product } from "@prisma/client";
import db from "@/libs/db";
import { getFilterRange } from "./range";
import { getUser } from "@/libs/session";
import { ProductPermissionEnum } from "@/enums/permission";

const getProducts = async (store: number): Promise<Product[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return await db.product.findMany({
      where: {
        store_id: store,
        user_store_id: user.hasPermission(ProductPermissionEnum.READ) ? user.userStoreId : undefined,
        ...await getFilterRange(),
        deleted: null
      },
    });
  } catch (error) {
    return [];
  }
};

export default getProducts;

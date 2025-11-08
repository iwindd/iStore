"use server";
import { HistoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { getFilterRange } from "./range";

export interface ProductOrder {
  serial: string;
  label: string;
  count: number;
  price: number;
  method: string;
  key: string;
}

const getProductOrder = async (): Promise<ProductOrder[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const order = await db.order.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        store_id: user.store,
        creator_id: !user.hasPermission(HistoryPermissionEnum.READ)
          ? user.userStoreId
          : undefined,
        ...(await getFilterRange()),
      },
      select: {
        method: true,
        products: {
          select: {
            serial: true,
            label: true,
            count: true,
            price: true,
          },
        },
      },
    });

    const productWithOwnKey = order.flatMap((item) =>
      item.products.map((product) => ({
        ...product,
        method: item.method,
      }))
    );

    // merge product.count if have same value serial, label and price
    const mergedProducts = productWithOwnKey.reduce((acc, product) => {
      const key = `${product.serial}-${product.label}-${product.price}-${product.method}`;
      if (!acc[key]) {
        acc[key] = {
          ...product,
          count: 0,
          key: key,
        };
      }
      acc[key].count += product.count;
      return acc;
    }, {} as Record<string, ProductOrder>);

    return Object.values(mergedProducts).sort((a, b) =>
      a.serial.localeCompare(b.serial)
    );
  } catch (error) {
    return [];
  }
};

export default getProductOrder;

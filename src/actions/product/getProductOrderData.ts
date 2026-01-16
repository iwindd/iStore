"use server";

import db from "@/libs/db";
import { PreOrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const getProductOrderData = async (productId: number) => {
  const orderProduct = await db.orderProduct.aggregate({
    where: {
      product_id: productId,
    },
    _sum: {
      profit: true,
      count: true,
    },
  });

  const preOrderProduct = await db.orderPreOrder.aggregate({
    where: {
      product_id: productId,
      status: PreOrderStatus.RETURNED,
    },
    _sum: {
      profit: true,
      count: true,
    },
  });

  const totalOrderProfit = orderProduct._sum.profit || new Decimal(0);
  const totalPreOrderProfit = preOrderProduct._sum.profit || new Decimal(0);
  const totalOrderCount = orderProduct._sum.count || 0;
  const totalPreOrderCount = preOrderProduct._sum.count || 0;

  return {
    totalProfit: totalOrderProfit.add(totalPreOrderProfit).toNumber(),
    totalOrderCount: totalOrderCount + totalPreOrderCount,
  };
};

export default getProductOrderData;

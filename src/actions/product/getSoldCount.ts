"use server";

import db from "@/libs/db";

const getProductOrderData = async (productId: number) => {
  const product = await db.product.findFirstOrThrow({
    where: {
      id: productId,
    },
    select: {
      orderProduct: {
        select: {
          count: true,
          price: true,
          cost: true,
        },
      },
    },
  });

  return product.orderProduct;
};

export default getProductOrderData;

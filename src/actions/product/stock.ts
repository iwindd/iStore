"use server";
import db from "@/libs/db";
import { ProductStock, ProductStockMovementType } from "@prisma/client";

type ProductStockMovementRelationInput =
  | {
      borrow_id: number;
    }
  | {
      order_id: number;
    }
  | {
      stock_receipt_id: number;
    };

const getOrCreateProductStock = async (
  product_id: number,
  tx?: any
): Promise<ProductStock> => {
  const context = tx || db;
  const productStock = await context.productStock.findUnique({
    where: { product_id },
  });

  if (productStock) return productStock;

  return context.productStock.create({
    data: {
      product_id,
      quantity: 0,
    },
  });
};

const setProductStock = async (
  product_id: number,
  amount: number,
  type: ProductStockMovementType,
  relation?: ProductStockMovementRelationInput,
  tx?: any
) => {
  const context = tx || db;
  const productStock = await getOrCreateProductStock(product_id, tx);
  const before = productStock.quantity;
  const after = amount;

  await context.productStockMovement.create({
    data: {
      product_id,
      quantity: amount,
      quantity_before: before,
      quantity_after: after,
      type,
      ...relation,
    },
  });

  return context.productStock.update({
    where: { id: productStock.id },
    data: {
      quantity: amount,
    },
  });
};

const addProductStock = async (
  product_id: number,
  amount: number,
  type: ProductStockMovementType,
  relation?: ProductStockMovementRelationInput,
  tx?: any
) => {
  const context = tx || db;
  const productStock = await getOrCreateProductStock(product_id, tx);
  const before = productStock.quantity;
  const after = before + amount;

  await context.productStockMovement.create({
    data: {
      product_id,
      quantity: amount,
      quantity_before: before,
      quantity_after: after,
      type,
      ...relation,
    },
  });

  return context.productStock.update({
    where: { id: productStock.id },
    data: {
      quantity: { increment: amount },
    },
  });
};

const removeProductStock = async (
  product_id: number,
  amount: number,
  type: ProductStockMovementType,
  relation?: ProductStockMovementRelationInput,
  tx?: any
) => {
  const context = tx || db;
  const productStock = await getOrCreateProductStock(product_id, tx);
  const before = productStock.quantity;
  const after = before - amount;

  await context.productStockMovement.create({
    data: {
      product_id,
      quantity: -amount,
      quantity_before: before,
      quantity_after: after,
      type,
      ...relation,
    },
  });

  return context.productStock.update({
    where: { id: productStock.id },
    data: {
      quantity: { decrement: amount },
    },
  });
};

export { addProductStock, removeProductStock, setProductStock };

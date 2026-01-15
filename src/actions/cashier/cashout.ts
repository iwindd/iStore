"use server";
import { CashierPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { CashoutSchema, CashoutValues } from "@/schema/Payment";
import { Order, Prisma, ProductStockMovementType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {CashoutHelper} from './cashout-helpers';

export type ValidateProduct = {
  id: number;
  stock: number;
  quantity: number;
  profit: number;
  cost: number;
  total: number;
  note?: string;
};

export const validateProducts = async (
  store_id: string,
  cartProducts: CashoutValues["products"],
  preOrderProducts?: CashoutValues["preOrderProducts"]
) => {
  const allRelateProductIds = [
    ...cartProducts.map((p) => p.id),
    ...(preOrderProducts?.map((p) => p.id) || []),
  ];

  const where: Prisma.ProductWhereInput = {
    store_id,
    id: { in: allRelateProductIds },
    deleted_at: null,
  };

  const products = await db.product.findMany({
    where,
    select: {
      id: true,
      stock: {
        select: {
          quantity: true,
        },
      },
      price: true,
      cost: true,
    },
  });

  const findProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found.`);
    return product;
  };

  const totalProducts: ValidateProduct[] = [];
  const totalPreOrderProducts: ValidateProduct[] = [];

  const validateProduct = (
    cartProduct: CashoutValues["products"][number],
    isPreOrder?: boolean
  ) => {
    const product = findProduct(cartProduct.id);

    if (!isPreOrder) {
      if ((product.stock?.quantity || 0) < cartProduct.quantity)
        throw new Error(`Product ${product.id} is out of stock.`);
    }

    const totalPrice = product.price * cartProduct.quantity;
    const totalCost = product.cost * cartProduct.quantity;
    const totalProfit = totalPrice - totalCost;

    return {
      id: product.id,
      stock: product.stock?.quantity || 0,
      quantity: cartProduct.quantity,
      profit: totalProfit,
      cost: totalCost,
      total: totalPrice,
      note: cartProduct.note,
    };
  };

  for (const cartProduct of cartProducts) {
    totalProducts.push(validateProduct(cartProduct));
  }

  if (preOrderProducts) {
    for (const preOrderProduct of preOrderProducts) {
      totalPreOrderProducts.push(validateProduct(preOrderProduct, true));
    }
  }

  return {
    products: totalProducts,
    preOrderProducts: totalPreOrderProducts,
    totalPrice: CashoutHelper.getTotalPrice([
      ...totalProducts,
      ...totalPreOrderProducts,
    ]),
    totalCost: CashoutHelper.getTotalCost([
      ...totalProducts,
      ...totalPreOrderProducts,
    ]),
    totalProfit: CashoutHelper.getTotalProfit([
      ...totalProducts,
      ...totalPreOrderProducts,
    ]),
  };
};

interface CashoutResponse extends Omit<Order, "created_at" | "updated_at"> {
  created_at: string;
  updated_at: string;
}

const Cashout = async (payload: CashoutValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CashierPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = CashoutSchema.parse(payload);
    const { products, preOrderProducts, totalPrice, totalCost, totalProfit } =
      await validateProducts(
        user.store,
        validated.products,
        validated.preOrderProducts
      );

    const order = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          total: new Decimal(totalPrice),
          cost: new Decimal(totalCost),
          profit: new Decimal(totalProfit),
          method: validated.method,
          note: validated.note,
          store_id: user.store,
          creator_id: user.employeeId,
        },
      });

      // Create Order Products
      await tx.orderProduct.createMany({
        data: products.map((product) => ({
          order_id: order.id,
          product_id: product.id,
          count: product.quantity,
          total: new Decimal(product.total),
          cost: new Decimal(product.cost),
          profit: new Decimal(product.profit),
          note: product.note,
        })),
      });

      // Remove Product Stock
      for (const product of products) {
        const stock = await tx.productStock.upsert({
          where: { product_id: product.id },
          create: { product_id: product.id, quantity: 0 },
          update: {},
        });

        if (stock.quantity < product.quantity) {
          throw new Error(`Product ${product.id} is out of stock`);
        }

        const before = stock.quantity;
        const after = before - product.quantity;

        await tx.productStockMovement.create({
          data: {
            order_id: order.id,
            product_id: product.id,
            type: ProductStockMovementType.SALE,
            quantity: -product.quantity,
            quantity_before: before,
            quantity_after: after,
          },
        });

        await tx.productStock.update({
          where: { id: stock.id },
          data: {
            quantity: { decrement: product.quantity },
          },
        });
      }

      // Create Pre Order Products
      await tx.orderPreOrder.createMany({
        data: preOrderProducts.map((product) => ({
          order_id: order.id,
          product_id: product.id,
          count: product.quantity,
          total: new Decimal(product.total),
          cost: new Decimal(product.cost),
          profit: new Decimal(product.profit),
          note: product.note,
        })),
      });

      return order;
    });

    return {
      success: true,
      data: {
        ...order,
        profit: order.profit.toNumber(),
        cost: order.cost.toNumber(),
        total: order.total.toNumber(),
        created_at: order.created_at.toISOString(),
        updated_at: order.updated_at.toISOString(),
      },
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<CashoutResponse>;
  }
};

export default Cashout;

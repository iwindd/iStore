"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { ConsignmentSchema, ConsignmentValues } from "@/schema/Consignment";
import { CashoutInputSchema, CashoutInputValues } from "@/schema/Payment";
import { ConsignmentStatus, ProductStockMovementType } from "@prisma/client";

const confirmConsignment = async (
  storeSlug: string,
  payload: {
    id: number;
    order: CashoutInputValues;
    consignment: ConsignmentValues;
  },
) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.consignment.updateSold);
  const validatedOrder = CashoutInputSchema.parse(payload.order);
  const validatedConsignment = ConsignmentSchema.parse(payload.consignment);
  const consignment = await db.consignment.findUniqueOrThrow({
    where: {
      id: payload.id,
      store_id: ctx.storeId!,
      status: ConsignmentStatus.PENDING,
    },
  });

  await db.$transaction(async (tx) => {
    // update consignment product
    const updatedConsignmentProducts: {
      quantitySold: number;
      quantityOut: number;
      product: {
        id: number;
        price: number;
        cost: number;
        note?: string;
        stock: {
          quantity: number;
        } | null;
      };
    }[] = [];
    for (const item of validatedConsignment.products) {
      const updated = await tx.consigmentProduct.update({
        where: { id: item.id },
        data: {
          quantitySold: item.quantitySold,
        },
        select: {
          quantitySold: true,
          quantityOut: true,
          note: true,
          product: {
            select: {
              id: true,
              price: true,
              cost: true,
              stock: {
                select: {
                  quantity: true,
                },
              },
            },
          },
        },
      });

      updatedConsignmentProducts.push({
        ...updated,
        quantitySold: updated.quantitySold || item.quantitySold || 0,
        product: {
          ...updated.product,
          price: updated.product.price.toNumber(),
          cost: updated.product.cost.toNumber(),
        },
      });
    }

    // update consignment
    await tx.consignment.update({
      where: { id: payload.id },
      data: {
        status: ConsignmentStatus.COMPLETED,
        completed_at: new Date(),
        completed_by_id: ctx.employeeId!,
      },
    });

    // create order
    const totalPrice = updatedConsignmentProducts.reduce((acc, item) => {
      return acc + item.quantitySold * item.product.price;
    }, 0);

    const totalCost = updatedConsignmentProducts.reduce((acc, item) => {
      return acc + item.quantitySold * item.product.cost;
    }, 0);
    const totalProfit = totalPrice - totalCost;

    const order = await tx.order.create({
      data: {
        total: totalPrice,
        cost: totalCost,
        profit: totalProfit,
        method: validatedOrder.method,
        note: validatedOrder.note,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
      },
    });

    await tx.orderProduct.createMany({
      data: updatedConsignmentProducts.map((cp) => ({
        order_id: order.id,
        product_id: cp.product.id,
        count: cp.quantitySold,
        total: cp.product.price * cp.quantitySold,
        cost: cp.product.cost * cp.quantitySold,
        profit: (cp.product.price - cp.product.cost) * cp.quantitySold,
        note: cp.product.note,
      })),
    });

    // Return ProductStock
    // Only products that were not fully sold need to have stock returned.
    const productsToReturn = updatedConsignmentProducts.filter(
      (cp) => cp.quantityOut - cp.quantitySold > 0,
    );

    if (productsToReturn.length > 0) {
      // Batch-fetch all stocks for products that need a return, upsert only
      // the missing ones.  This reduces per-product queries from 3N to
      // N + a small constant.
      const returnProductIds = productsToReturn.map((cp) => cp.product.id);
      const existingStocks = await tx.productStock.findMany({
        where: { product_id: { in: returnProductIds } },
      });
      const stockMap = new Map(existingStocks.map((s) => [s.product_id, s]));

      const missingProductIds = returnProductIds.filter(
        (id) => !stockMap.has(id),
      );
      if (missingProductIds.length > 0) {
        await tx.productStock.createMany({
          data: missingProductIds.map((product_id) => ({
            product_id,
            quantity: 0,
          })),
        });
        const newStocks = await tx.productStock.findMany({
          where: { product_id: { in: missingProductIds } },
        });
        newStocks.forEach((s) => stockMap.set(s.product_id, s));
      }

      await tx.productStockMovement.createMany({
        data: productsToReturn.map((cp) => {
          const quantityLeft = cp.quantityOut - cp.quantitySold;
          const stockBefore = stockMap.get(cp.product.id)!.quantity;
          return {
            consignment_id: consignment.id,
            product_id: cp.product.id,
            type: ProductStockMovementType.CONSIGNMENT_RETURNED,
            quantity: quantityLeft,
            quantity_before: stockBefore,
            quantity_after: stockBefore + quantityLeft,
          };
        }),
      });

      for (const cp of productsToReturn) {
        const quantityLeft = cp.quantityOut - cp.quantitySold;
        await tx.productStock.update({
          where: { id: stockMap.get(cp.product.id)!.id },
          data: { quantity: { increment: quantityLeft } },
        });
      }
    }
  });
};

export default confirmConsignment;

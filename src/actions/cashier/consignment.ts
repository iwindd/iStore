"use server";
import { ConsignmentPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { ConsignmentSchema, ConsignmentValues } from "@/schema/Payment";
import { ProductStockMovementType } from "@prisma/client";
import { validateProducts } from "./cashout";

export const Consignment = async (payload: ConsignmentValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(ConsignmentPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = ConsignmentSchema.parse(payload);
    const { products } = await validateProducts(user.store, validated.products);

    const consignment = await db.$transaction(async (tx) => {
      const consignment = await tx.consignment.create({
        data: {
          store_id: user.store,
          creator_id: user.employeeId,
          note: validated.note,
        },
      });

      // Create Order Products
      await tx.consigmentProduct.createMany({
        data: products.map((product) => ({
          consignment_id: consignment.id,
          product_id: product.id,
          note: product.note,
          quantityOut: product.quantity,
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
            consignment_id: consignment.id,
            product_id: product.id,
            type: ProductStockMovementType.CONSIGNMENT,
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

      return consignment;
    });

    return {
      success: true,
      consignment: {
        ...consignment,
        created_at: consignment.created_at.toISOString(),
        updated_at: consignment.updated_at.toISOString(),
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

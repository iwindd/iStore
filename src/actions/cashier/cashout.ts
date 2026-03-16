"use server";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getPromotionQuantities } from "@/libs/promotion";
import { CashoutSchema, CashoutValues } from "@/schema/Payment";
import { Prisma, ProductStockMovementType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { uniq } from "lodash";
import {
  CashoutHelper,
  GetObtainPromotionBuyXGetYInstance,
} from "./cashout-helpers";

export type ValidateProduct = {
  id: number;
  stock: number;
  quantity: number;
  profit: number;
  cost: number;
  total: number;
  note?: string;
};

export type PromotionBuyXGetYValidateProduct = Omit<
  ValidateProduct,
  "quantity" | "profit"
> & {
  receivedCount: number;
  freeCount: number;
  promotion_buy_x_get_y_id: number;
};

export const validateProducts = async (
  store_id: string,
  cartProducts: CashoutValues["products"],
  preOrderProducts?: CashoutValues["preOrderProducts"],
) => {
  const obtainPromotionBuyXGetYs =
    await CashoutHelper.getObtainPromotionBuyXGetY(cartProducts, store_id);

  const allRelateProductIds = uniq([
    ...cartProducts.map((p) => p.id),
    ...(preOrderProducts?.map((p) => p.id) || []),
    ...obtainPromotionBuyXGetYs.flatMap((p) =>
      p.getItems.map((item) => item.product_id),
    ),
  ]);

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

  // Build a Map for O(1) lookups instead of O(n) Array.find on every call
  const productById = new Map(products.map((p) => [p.id, p]));

  const findProduct = (id: number) => {
    const product = productById.get(id);
    if (!product) throw new Error(`Product with ID ${id} not found.`);
    return product;
  };

  const totalProducts: ValidateProduct[] = [];
  const totalPreOrderProducts: ValidateProduct[] = [];
  const totalObtainPromotionBuyXGetYProducts: PromotionBuyXGetYValidateProduct[] =
    [];

  const getStockRemaining = (productId: number) => {
    const product = findProduct(productId);
    const productStock = product.stock?.quantity || 0;

    const fromCart =
      totalProducts.find((p) => p.id === productId)?.quantity || 0;
    const fromObtainPromotionBuyXGetY = totalObtainPromotionBuyXGetYProducts
      .filter((p) => p.id === productId)
      .reduce((total, p) => total + p.receivedCount, 0);

    console.log(
      productStock,
      fromCart,
      fromObtainPromotionBuyXGetY,
      product.id,
      Math.max(productStock - (fromCart + fromObtainPromotionBuyXGetY), 0),
    );
    return Math.max(productStock - (fromCart + fromObtainPromotionBuyXGetY), 0);
  };

  const validateProduct = (
    cartProduct: Omit<CashoutValues["products"][number], "productId">,
    isPreOrder?: boolean,
  ) => {
    const product = findProduct(cartProduct.id);

    if (!isPreOrder) {
      if ((product.stock?.quantity || 0) < cartProduct.quantity)
        throw new Error(`Product ${product.id} is out of stock.`);
    }

    const totalPrice = product.price.mul(cartProduct.quantity);
    const totalCost = product.cost.mul(cartProduct.quantity);
    const totalProfit = totalPrice.sub(totalCost);

    return {
      id: product.id,
      stock: product.stock?.quantity || 0,
      quantity: cartProduct.quantity,
      profit: totalProfit.toNumber(),
      cost: totalCost.toNumber(),
      total: totalPrice.toNumber(),
      note: cartProduct.note,
    };
  };

  const validateProductPromotionBuyXGetY = (
    obtainPromotionBuyXGetY: GetObtainPromotionBuyXGetYInstance,
  ) => {
    const getProducts = getPromotionQuantities(
      obtainPromotionBuyXGetY.buyItems,
      obtainPromotionBuyXGetY.getItems,
      totalProducts.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
      })),
    );

    const promotionProducts: PromotionBuyXGetYValidateProduct[] = [];

    for (const getProduct of getProducts) {
      const product = findProduct(getProduct.id);

      const remainProductStock = getStockRemaining(getProduct.id);

      const receivedCount = Math.min(getProduct.quantity, remainProductStock);
      const freeCount = getProduct.quantity;

      if (getProduct.quantity > remainProductStock) {
        console.warn(
          `[PromotionBuyXGetY Cashout] Adjust quantity of product ${getProduct.id} to ${remainProductStock}`,
        );
      }

      const totalPrice = product.price.mul(receivedCount);
      const totalCost = product.cost.mul(receivedCount);

      promotionProducts.push({
        id: product.id,
        stock: product.stock?.quantity || 0,
        receivedCount: receivedCount,
        freeCount: freeCount,
        cost: totalCost.toNumber(),
        total: totalPrice.toNumber(),
        promotion_buy_x_get_y_id: obtainPromotionBuyXGetY.id,
      });
    }

    return promotionProducts;
  };

  for (const cartProduct of cartProducts) {
    totalProducts.push(validateProduct(cartProduct));
  }

  if (preOrderProducts) {
    for (const preOrderProduct of preOrderProducts) {
      totalPreOrderProducts.push(validateProduct(preOrderProduct, true));
    }
  }

  for (const obtainPromotionBuyXGetY of obtainPromotionBuyXGetYs) {
    const promotionProducts = validateProductPromotionBuyXGetY(
      obtainPromotionBuyXGetY,
    );

    totalObtainPromotionBuyXGetYProducts.push(...promotionProducts);
  }

  return {
    products: totalProducts,
    preOrderProducts: totalPreOrderProducts,
    obtainPromotionBuyXGetYProducts: totalObtainPromotionBuyXGetYProducts,
    totalPrice: CashoutHelper.getTotalPrice([
      ...totalProducts,
      ...totalPreOrderProducts,
    ]),
    totalCost: CashoutHelper.getTotalCost([
      ...totalProducts,
      ...totalPreOrderProducts,
      ...totalObtainPromotionBuyXGetYProducts,
    ]),
    totalProfit: CashoutHelper.getTotalProfit([
      ...totalProducts,
      ...totalPreOrderProducts,
    ]),
  };
};

const Cashout = async (storeSlug: string, payload: CashoutValues) => {
  const ctx = await getPermissionContext(storeSlug);
  assertStoreCan(ctx, PermissionConfig.store.cashier.cashout);

  const validated = CashoutSchema.parse(payload);
  const {
    products,
    preOrderProducts,
    obtainPromotionBuyXGetYProducts,
    totalPrice,
    totalCost,
    totalProfit,
  } = await validateProducts(
    ctx.storeId!,
    validated.products,
    validated.preOrderProducts,
  );

  const order = await db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        total: new Decimal(totalPrice),
        cost: new Decimal(totalCost),
        profit: new Decimal(totalProfit),
        method: validated.method,
        note: validated.note,
        store_id: ctx.storeId!,
        creator_id: ctx.employeeId!,
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

    // Batch-fetch all product stocks needed for both the cart and
    // the promotion products in a single query, then upsert only the
    // records that are missing.  This avoids an individual upsert+update
    // per product (3N queries → N + a small constant number of queries).
    const allStockProductIds = [
      ...products.map((p) => p.id),
      ...obtainPromotionBuyXGetYProducts.map((p) => p.id),
    ];
    const uniqueStockProductIds = [...new Set(allStockProductIds)];

    const existingStocks = await tx.productStock.findMany({
      where: { product_id: { in: uniqueStockProductIds } },
    });
    const stockMap = new Map(existingStocks.map((s) => [s.product_id, s]));

    // Create any missing stock records in a single batch
    const missingProductIds = uniqueStockProductIds.filter(
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

    // Track in-memory running quantities so movement records for promotion
    // products correctly reflect quantities already decremented by cart items.
    const currentQty = new Map<number, number>();
    for (const [id, s] of stockMap) {
      currentQty.set(id, s.quantity);
    }

    // Remove Product Stock Of Cart
    await tx.productStockMovement.createMany({
      data: products.map((product) => {
        const before = currentQty.get(product.id) ?? 0;
        const after = before - product.quantity;
        currentQty.set(product.id, after);
        return {
          order_id: order.id,
          product_id: product.id,
          type: ProductStockMovementType.SOLD,
          quantity: -product.quantity,
          quantity_before: before,
          quantity_after: after,
        };
      }),
    });

    for (const product of products) {
      await tx.productStock.update({
        where: { id: stockMap.get(product.id)!.id },
        data: { quantity: { decrement: product.quantity } },
      });
    }

    // Create Order Product Promotion Buy X Get Y
    await tx.orderProductPromotionBuyXGetY.createMany({
      data: obtainPromotionBuyXGetYProducts.map((product) => ({
        order_id: order.id,
        promotionBuyXGetY_id: product.promotion_buy_x_get_y_id,
        product_id: product.id,
        received_count: product.receivedCount,
        free_count: product.freeCount,
        total: new Decimal(product.total),
        cost: new Decimal(product.cost),
        note: product.note,
      })),
    });

    // Remove Product Stock Of Promotion
    // Validate promotion product stock levels using in-memory quantities
    // (which already reflect cart deductions computed above).
    for (const product of obtainPromotionBuyXGetYProducts) {
      const currentStock = currentQty.get(product.id) ?? 0;
      if (currentStock < product.receivedCount) {
        throw new Error(`Product ${product.id} is out of stock`);
      }
    }

    await tx.productStockMovement.createMany({
      data: obtainPromotionBuyXGetYProducts.map((product) => {
        const before = currentQty.get(product.id) ?? 0;
        const after = before - product.receivedCount;
        currentQty.set(product.id, after);
        return {
          order_id: order.id,
          product_id: product.id,
          type: ProductStockMovementType.SOLD_PROMOTION,
          quantity: -product.receivedCount,
          quantity_before: before,
          quantity_after: after,
        };
      }),
    });

    for (const product of obtainPromotionBuyXGetYProducts) {
      await tx.productStock.update({
        where: { id: stockMap.get(product.id)!.id },
        data: { quantity: { decrement: product.receivedCount } },
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
};

export default Cashout;

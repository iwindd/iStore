"use server";
import { CashierPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import {
  getPromotionQuantities,
  mergePromotionQuantities,
} from "@/libs/promotion";
import { getUser } from "@/libs/session";
import { User } from "@/libs/user";
import { CartProduct } from "@/reducers/cartReducer";
import { CashoutSchema, CashoutValues } from "@/schema/Payment";
import { Order, Prisma, ProductStockMovementType } from "@prisma/client";
import { removeProductStock } from "../product/stock";
import {
  adjustOfferQuantity,
  calculateTotals,
  getStockInfo,
  getTotalCost,
  getTotalPrice,
  validateStock,
} from "./cashout-helpers";

type TotalProduct = Prisma.ProductGetPayload<{
  select: {
    id: true;
    serial: true;
    label: true;
    stock: true;
    price: true;
    cost: true;
    category: { select: { label: true; overstock: true } };
  };
}> & {
  offerQuantity: number;
  promotion_offer_id: number[];
  note?: string;
} & ReturnType<typeof calculateTotals>;

const validateProducts = async (
  user: User,
  cart: CashoutValues["products"]
) => {
  const offers = await getPromotionOffers(user, cart);
  const getOffer = (id: number) => offers.find((o) => o.id === id);
  const where: Prisma.ProductWhereInput = {
    store_id: user.store,
    id: { in: [...cart.map((p) => p.id), ...offers.map((o) => o.id)] },
    deleted_at: null,
  };

  const select: Prisma.ProductSelect = {
    id: true,
    serial: true,
    label: true,
    stock: true,
    price: true,
    cost: true,
    category: { select: { label: true, overstock: true } },
  };

  const products = await db.product.findMany({
    where,
    select,
  });

  const findProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error(`Product with ID ${id} not found.`);
    return product;
  };

  const totalProducts: TotalProduct[] = [];

  for (const cartItem of cart) {
    const product = findProduct(cartItem.id);
    const { stock, canOverStock } = getStockInfo(product);

    validateStock(product, cartItem.quantity, stock, canOverStock);

    const offer = getOffer(cartItem.id);
    const offerQuantity = offer
      ? adjustOfferQuantity(
          offer.quantity,
          cartItem.quantity,
          stock,
          canOverStock
        )
      : 0;

    const totals = calculateTotals(
      product,
      cartItem.quantity,
      offerQuantity,
      stock
    );

    totalProducts.push({
      ...product,
      ...totals,
      offerQuantity,
      promotion_offer_id: offer?.promotion_offer_id ?? [],
      note: cartItem.note,
    });
  }

  for (const offer of offers) {
    if (cart.some((c) => c.id === offer.id)) continue;

    const product = findProduct(offer.id);
    const { stock, canOverStock } = getStockInfo(product);

    const offerQuantity = adjustOfferQuantity(
      offer.quantity,
      0,
      stock,
      canOverStock
    );

    const totals = calculateTotals(product, 0, offerQuantity, stock);

    totalProducts.push({
      ...product,
      ...totals,
      offerQuantity,
      promotion_offer_id: offer.promotion_offer_id,
    });
  }

  return totalProducts;
};

const getPromotionOffers = async (
  user: User,
  products: Pick<CartProduct, "id" | "quantity">[]
) => {
  const relatedOffers = await db.promotionOffer.findRelatedPromotionOffer({
    productIds: products.map((p) => p.id),
    where: {
      event: {
        store_id: user.store,
      },
    },
    select: {
      id: true,
      getItems: {
        select: {
          quantity: true,
          product_id: true,
          product: {
            select: {
              stock: true,
              category: {
                select: {
                  overstock: true,
                },
              },
            },
          },
        },
      },
      buyItems: {
        select: {
          product_id: true,
          quantity: true,
        },
      },
    },
  });

  const quantifiedOffers = relatedOffers.map((offer) => {
    return getPromotionQuantities(offer.buyItems, offer.getItems, products)
      .filter((item) => item.quantity > 0)
      .map((item) => ({ ...item, promotion_offer_id: offer.id }));
  });

  const mergedPromotionQuantities = mergePromotionQuantities(quantifiedOffers);
  return mergedPromotionQuantities;
};

interface CashoutResponse extends Omit<Order, "created_at" | "updated_at"> {
  created_at: string;
  updated_at: string;
}

const Cashout = async (
  payload: CashoutValues
): Promise<ActionResponse<CashoutResponse>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CashierPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = CashoutSchema.parse(payload);
    console.log(validated);
    const products = await validateProducts(user, validated.products);

    const totalPrice = getTotalPrice(products);
    const totalCost = getTotalCost(products);
    const totalProfit = totalPrice - totalCost;

    // CREATE ORDER
    const order = await db.$transaction(async (tx) => {
      const order = await db.order.create({
        data: {
          price: totalPrice,
          cost: totalCost,
          profit: totalProfit,
          method: validated.method,
          note: validated.note || "",
          text: products.map((item) => item.label).join(", "),
          store_id: user.store,
          creator_id: user.employeeId,
          products: {
            create: products.map(({ id, ...product }) => ({
              serial: product.serial,
              label: product.label,
              category: product.category?.label || "ไม่มี่หมวดหมู่",
              price: product.price,
              cost: product.cost,
              count: product.quantity,
              overstock: product.overstockCount,
              note: product.note,
              promotionOffers: {
                connect: product.promotion_offer_id.map((id) => ({ id })),
              },
            })),
          },
        },
      });
      for (const item of products) {
        await removeProductStock(
          item.id,
          item.quantity,
          ProductStockMovementType.SALE,
          { order_id: order.id },
          tx
        );

        await tx.product.update({
          where: { id: item.id },
          data: {
            sold: { increment: item.quantity },
          },
        });
      }

      return order;
    });

    return {
      success: true,
      data: {
        ...order,
        created_at: order.created_at.toISOString(),
        updated_at: order.updated_at.toISOString(),
      },
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<CashoutResponse>;
  }
};

export default Cashout;

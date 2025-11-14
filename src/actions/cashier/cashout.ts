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
import { Order, Prisma } from "@prisma/client";

const validateProducts = async (
  user: User,
  cart: Pick<CartProduct, "id" | "quantity">[]
) => {
  const offers = await getPromotionOffers(user, cart);

  const isOfferProduct = (productId: number) =>
    offers.some((offer) => offer.id === productId);

  const isCartProduct = (productId: number) =>
    cart.some((item) => item.id === productId);

  const getOfferQuantity = (productId: number) =>
    offers.find((offer) => offer.id === productId)?.quantity || 0;

  const getPromotionOfferId = (productId: number) =>
    offers.find((offer) => offer.id === productId)?.promotion_offer_id || [];

  const products = (await db.product.findMany({
    where: {
      store_id: user.store,
      id: {
        in: [...cart.map((p) => p.id), ...offers.map((o) => o.id)],
      },
      deleted_at: null,
    },
    select: {
      id: true,
      serial: true,
      label: true,
      stock: true,
      price: true,
      cost: true,
      category: {
        select: {
          label: true,
          overstock: true,
        },
      },
    },
  })) as unknown as Prisma.ProductGetPayload<{
    select: {
      id: true;
      serial: true;
      label: true;
      stock: true;
      price: true;
      cost: true;
      category: {
        select: {
          label: true;
          overstock: true;
        };
      };
    };
  }>[];

  const totalProducts: ((typeof products)[0] & {
    offerQuantity: number;
    quantity: number;
    totalPrice: number;
    discountFromOffer: number;
    isOverstock: boolean;
    overstockCount: number;
    promotion_offer_id: number[];
  })[] = [];

  const validateProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error(`Product with ID ${productId} not found.`);
    return product;
  };

  for (const cartItem of cart) {
    const product = validateProduct(cartItem.id);
    // STOCK VALIDATION
    const stock = product.stock;
    const canOverStock = product.category?.overstock || false;
    const quantity = cartItem.quantity;
    if (!canOverStock && quantity > stock) {
      console.error(`Stock of product "${product.label}" is insufficient.`);
      throw new Error(`Stock of product "${product.label}" is insufficient.`);
    }

    // OFFER VALIDATION
    let offerQuantity = getOfferQuantity(cartItem.id);
    if (isOfferProduct(cartItem.id) && offerQuantity > 0) {
      if (quantity + offerQuantity > stock && !canOverStock) {
        offerQuantity = Math.max(0, stock - quantity);
        console.warn(
          `Adjusted offer quantity for product "${
            product.label
          }" from ${getOfferQuantity(
            cartItem.id
          )} to ${offerQuantity} due to stock limitations.`
        );
      }
    }

    const totalQuantity = quantity + offerQuantity;
    const discountFromOffer = offerQuantity * product.price;
    const isOverstock = totalQuantity > stock;
    const overStockCount = isOverstock ? totalQuantity - stock : 0;

    totalProducts.push({
      ...product,
      offerQuantity,
      quantity: totalQuantity,
      totalPrice: product.price * totalQuantity - discountFromOffer,
      discountFromOffer: discountFromOffer,
      isOverstock: totalQuantity > stock,
      overstockCount: overStockCount,
      promotion_offer_id: getPromotionOfferId(cartItem.id),
    });
  }

  for (const offer of offers) {
    if (isCartProduct(offer.id)) continue; // Already processed in cart loop
    const product = validateProduct(offer.id);
    // OFFER-ONLY PRODUCT
    let offerQuantity = offer.quantity;
    const stock = product.stock;
    const canOverStock = product.category?.overstock || false;
    if (offerQuantity > stock && !canOverStock) {
      offerQuantity = stock;
      console.warn(
        `Adjusted offer quantity for product "${product.label}" from ${offer.quantity} to ${offerQuantity} due to stock limitations.`
      );
    }
    const isOverstock = offerQuantity > stock;
    const overStockCount = isOverstock ? offerQuantity - stock : 0;

    totalProducts.push({
      ...product,
      offerQuantity,
      quantity: offerQuantity,
      totalPrice: 0,
      discountFromOffer: offerQuantity * product.price,
      isOverstock: isOverstock,
      overstockCount: overStockCount,
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

const updateProductStock = async (
  products: { id: number; count: number }[]
) => {
  return db.$transaction(
    products.map((product) => {
      return db.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: { decrement: product.count },
          sold: { increment: product.count },
        },
      });
    })
  );
};

const getTotalPrice = (
  products: { totalPrice: number; quantity: number }[]
) => {
  return products.reduce((total, item) => total + item.totalPrice, 0);
};

const getTotalCost = (products: { cost: number; quantity: number }[]) => {
  return products.reduce((total, item) => total + item.cost * item.quantity, 0);
};

const Cashout = async (
  payload: CashoutValues
): Promise<ActionResponse<Order>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CashierPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = CashoutSchema.parse(payload);
    const products = await validateProducts(user, validated.products);

    const totalPrice = getTotalPrice(products);
    const totalCost = getTotalCost(products);
    const totalProfit = totalPrice - totalCost;

    // CREATE ORDER
    const order = await db.order.create({
      data: {
        price: totalPrice,
        cost: totalCost,
        profit: totalProfit,
        method: validated.method,
        note: validated.note || "",
        text: products.map((item) => item.label).join(", "),
        store_id: user.store,
        creator_id: user.userStoreId,
        products: {
          create: products.map(({ id, ...product }) => ({
            serial: product.serial,
            label: product.label,
            category: product.category?.label || "ไม่มี่หมวดหมู่",
            price: product.price,
            cost: product.cost,
            count: product.quantity,
            overstock: product.overstockCount,
            promotionOffers: {
              connect: product.promotion_offer_id.map((id) => ({ id })),
            },
          })),
        },
      },
    });

    updateProductStock(
      products.map(({ id, quantity }) => ({ id, count: quantity }))
    );

    return { success: true, data: order };
  } catch (error) {
    return ActionError(error) as ActionResponse<Order>;
  }
};

export default Cashout;

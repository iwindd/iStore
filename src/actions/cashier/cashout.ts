"use server";
import { CashierPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { User } from "@/libs/user";
import { CartProduct } from "@/reducers/cartReducer";
import { CashoutSchema, CashoutValues } from "@/schema/Payment";
import { Order } from "@prisma/client";

const validateProducts = async (user: User, products: CartProduct[]) => {
  const rawProducts = await db.product.findMany({
    where: {
      store_id: user.store,
      id: { in: products.map((p) => p.id) },
      deleted_at: null,
    },
    include: {
      category: {
        select: {
          label: true,
          overstock: true,
        },
      },
    },
  });

  const validated = rawProducts.map((product) => {
    const cartProduct = products.find((p) => p.id == product.id) as CartProduct;
    const canOverStock = product.category?.overstock || false;
    const count =
      !canOverStock && cartProduct.quantity > product.stock
        ? product.stock
        : cartProduct.quantity;
    const isOverStock = count > product.stock;

    return {
      id: product.id,
      serial: product.serial,
      label: product.label,
      price: product.price,
      cost: product.cost,
      count: count,
      category: product.category?.label || "ไม่มีประเภท",
      overstock: isOverStock ? count - product.stock : 0,
    };
  }) as {
    id: number;
    serial: string;
    label: string;
    price: number;
    cost: number;
    count: number;
    category: string;
    overstock: number;
  }[];

  return validated;
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
    const products = await validateProducts(user, payload.products);
    const totalPrice = products.reduce(
      (total, item) => total + item.price * item.count,
      0
    );
    const totalCost = products.reduce(
      (total, item) => total + item.cost * item.count,
      0
    );
    const totalProfit = totalPrice - totalCost;

    // CREATE ORDER
    const order = await db.order.create({
      data: {
        price: totalPrice,
        cost: totalCost,
        profit: totalProfit,
        method: payload.method,
        note: payload.note || "",
        text: products.map((item) => item.label).join(", "),
        store_id: user.store,
        creator_id: user.userStoreId,
        products: {
          create: products.map(({ id, ...product }) => ({
            ...product,
          })),
        },
      },
    });

    db.$transaction(
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

    return { success: true, data: order };
  } catch (error) {
    return ActionError(error) as ActionResponse<Order>;
  }
};

export default Cashout;

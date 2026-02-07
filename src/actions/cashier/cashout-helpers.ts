import db from "@/libs/db";

export type GetObtainPromotionBuyXGetYInstance = Awaited<
  ReturnType<typeof CashoutHelper.getObtainPromotionBuyXGetY>
>[number];

export class CashoutHelper {
  /**
   * Get total price of products
   * @param products
   * @returns
   */
  static getTotalPrice(products: { total: number }[]) {
    return products.reduce((total, item) => total + item.total, 0);
  }

  /**
   * Get total cost of products
   * @param products
   * @returns
   */
  static getTotalCost(products: { cost: number }[]) {
    return products.reduce((total, item) => total + item.cost, 0);
  }

  /**
   * Get total profit of products
   * @param products
   * @returns
   */
  static getTotalProfit(products: { profit: number }[]) {
    return products.reduce((total, item) => total + item.profit, 0);
  }

  /**
   * Get obtain promotion buy x get y
   * @param products
   * @param storeId
   * @returns
   */
  static async getObtainPromotionBuyXGetY(
    products: {
      id: number;
      quantity: number;
    }[],
    storeId: string,
  ) {
    const result = await db.promotionOffer.findMany({
      where: {
        event: {
          store_id: storeId,
          start_at: { lte: new Date() },
          end_at: { gte: new Date() },
          disabled_at: null,
        },

        buyItems: {
          every: {
            OR: products.map((product) => ({
              product_id: product.id,
              quantity: {
                lte: product.quantity,
              },
            })),
          },
        },
      },
      select: {
        id: true,
        buyItems: {
          select: {
            id: true,
            quantity: true,
            product_id: true,
          },
        },
        getItems: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                label: true,
                serial: true,
                price: true,
                stock: true,
              },
            },
            product_id: true,
          },
        },
        event: {
          select: {
            id: true,
            start_at: true,
            end_at: true,
          },
        },
      },
    });

    return result;
  }
}

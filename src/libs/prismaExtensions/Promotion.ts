import { Prisma } from "@prisma/client";

interface RelatedPromotionOfferArgs {
  productIds: number[];
  disableOnlyActive?: boolean;
}

export const promotionExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "promotion",
    model: {
      promotionOffer: {
        async findRelatedPromotionOffer<
          T,
          A extends Prisma.Args<T, "findMany">,
        >(
          this: T,
          {
            productIds,
            disableOnlyActive,
            ...args
          }: A & RelatedPromotionOfferArgs,
        ): Promise<Prisma.PromotionOfferGetPayload<A>[]> {
          const isDisableOnlyActive = disableOnlyActive ?? true;
          const limit = 3;

          const activeEventWhere = isDisableOnlyActive
            ? {
                start_at: {
                  lte: new Date(),
                },
                end_at: {
                  gte: new Date(),
                },
                disabled_at: null,
              }
            : {};

          // 1. Fetch related promotions (if productIds provided)
          let relatedOffers: any[] = [];
          if (productIds && productIds.length > 0) {
            relatedOffers = await (this as any).findMany({
              ...args,
              take: limit,
              where: {
                ...args.where,
                buyItems: {
                  some: {
                    product_id: {
                      in: productIds,
                    },
                  },
                },
                event: {
                  ...args.where?.event,
                  ...activeEventWhere,
                },
              },
            });
          }

          // 2. If we haven't reached the limit, fetch unrelated active promotions
          if (relatedOffers.length < limit) {
            const excludeIds = relatedOffers.map((o) => o.id);
            const remaining = limit - relatedOffers.length;

            const otherOffers = await (this as any).findMany({
              ...args,
              take: remaining,
              where: {
                ...args.where,
                id: {
                  notIn: excludeIds,
                },
                event: {
                  ...args.where?.event,
                  ...activeEventWhere,
                },
              },
            });

            return [...relatedOffers, ...otherOffers];
          }

          return relatedOffers;
        },
      },
    },
  });
});

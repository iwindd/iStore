import { Prisma } from "../../../prisma/generated/prisma/client";

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
          const result = (this as any).findMany({
            ...args,
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
                ...(isDisableOnlyActive
                  ? {
                      start_at: {
                        lte: new Date(),
                      },
                      end_at: {
                        gte: new Date(),
                      },
                      disabled_at: null,
                    }
                  : {}),
              },
            },
          });

          return result;
        },
      },
    },
  });
});

import { Prisma } from "@prisma/client";

interface RelatedPromotionOfferArgs {
  productIds: number[];
}

export const promotionExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "promotion",
    model: {
      promotionOffer: {
        async findRelatedPromotionOffer<
          T,
          A extends Prisma.Args<T, "findMany">
        >(
          this: T,
          { productIds, ...args }: A & RelatedPromotionOfferArgs
        ): Promise<Prisma.PromotionOfferGetPayload<A>[]> {
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
            },
          });

          return result;
        },
      },
    },
  });
});

"use server";
import { TableFetch } from "@/components/Datatable";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { DatatableFetchResult } from "@/libs/prismaExtensions/Datatable";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type PromotionDatatableInstance = Prisma.PromotionOfferGetPayload<{
  select: {
    id: true;
    event: {
      select: {
        id: true;
        title: true;
        description: true;
        start_at: true;
        end_at: true;
        creator: {
          select: {
            user: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
    buyItems: {
      select: {
        quantity: true;
        product: {
          select: {
            label: true;
          };
        };
      };
    };
    getItems: {
      select: {
        quantity: true;
        product: {
          select: {
            label: true;
          };
        };
      };
    };
  };
}>;

const fetchPromotionDatatable = async (
  table: TableFetch
): Promise<DatatableFetchResult<PromotionDatatableInstance>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const result = await db.promotionOffer.datatableFetch({
      table,
      where: {
        event: {
          store_id: user.store,
        },
      },
      orderBy: [{ updated_at: "desc" }, { created_at: "desc" }],
      select: {
        id: true,
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            start_at: true,
            end_at: true,
            creator: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        buyItems: {
          select: {
            quantity: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
        getItems: {
          select: {
            quantity: true,
            product: {
              select: {
                label: true,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};

export default fetchPromotionDatatable;

"use server";
import { TableFetch } from "@/components/Datatable";
import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export type PromotionDatatableInstance = Awaited<
  ReturnType<typeof getPromotionDatatable>
>["data"][number];

const getPromotionDatatable = async (table: TableFetch) => {
  try {
    const ctx = await getPermissionContext(table.storeIdentifier);
    assertStoreCan(ctx, PermissionConfig.store.promotion.getDatatable);

    const result = await db.promotionOffer.getDatatable({
      query: table,
      where: {
        event: {
          store_id: ctx.storeId!,
        },
      },
      select: {
        id: true,
        event: {
          select: {
            id: true,
            name: true,
            note: true,
            start_at: true,
            end_at: true,
            disabled_at: true,
            creator: {
              select: {
                user: {
                  select: {
                    first_name: true,
                    last_name: true,
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
    console.error(`getPromotionDatatable error :`, error);
    return {
      data: [],
      total: 0,
    };
  }
};

export default getPromotionDatatable;

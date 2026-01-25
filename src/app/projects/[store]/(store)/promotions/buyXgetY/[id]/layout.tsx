"use server";

import { PermissionConfig } from "@/config/permissionConfig";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { notFound } from "next/navigation";
import { BuyXGetYProvider } from "./ProductContext";

const BuyXGetYLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; store: string }>;
}) => {
  const { id, store } = await params;
  const ctx = await getPermissionContext(store);
  assertStoreCan(ctx, PermissionConfig.store.promotion.getDetail);
  const productSelect = {
    quantity: true,
    product: {
      select: {
        id: true,
        serial: true,
        label: true,
        price: true,
        cost: true,
        stock: true,
        category: {
          select: {
            label: true,
            overstock: true,
          },
        },
      },
    },
  };

  const offer = await db.promotionOffer.findFirst({
    where: {
      id: Number(id),
      event: {
        store_id: ctx.storeId!,
      },
    },
    select: {
      id: true,
      event: {
        select: {
          name: true,
          note: true,
          start_at: true,
          end_at: true,
          disabled_at: true,
        },
      },
      getItems: {
        select: productSelect,
      },
      buyItems: {
        select: productSelect,
      },
    },
  });

  if (!offer) return notFound();

  return (
    <BuyXGetYProvider
      value={{
        id: offer.id,
        name: offer.event.name,
        note: offer.event.note,
        start_at: offer.event.start_at,
        end_at: offer.event.end_at,
        disabled_at: offer.event.disabled_at,
        needProducts: offer.buyItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        offerProducts: offer.getItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      }}
    >
      {children}
    </BuyXGetYProvider>
  );
};

export default BuyXGetYLayout;

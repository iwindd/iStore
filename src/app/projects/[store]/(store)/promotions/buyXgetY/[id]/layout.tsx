"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { BuyXGetYProvider } from "./ProductContext";

const BuyXGetYLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUser();
  if (!user) return notFound();
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
        store_id: user.store,
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

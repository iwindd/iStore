"use server";
import { StorePermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

export interface EventSelectorItem {
  id: number;
  name: string | null;
  note: string | null;
  start_at: Date;
  end_at: Date;
}

/**
 * Search events by note for selector dropdown
 */
export const searchEvents = async (
  storeSlug: string,
  query: string,
): Promise<EventSelectorItem[]> => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);

    const events = await db.event.findMany({
      where: {
        store_id: ctx.storeId!,
        disabled_at: null,
        end_at: { gte: new Date() },
        OR: [
          {
            note: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        note: true,
        start_at: true,
        end_at: true,
      },
      orderBy: { start_at: "asc" },
      take: 10,
    });

    return events;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};

/**
 * Find a single event by ID
 */
export const findEvent = async (
  storeSlug: string,
  id: number,
): Promise<EventSelectorItem | null> => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);

    const event = await db.event.findFirst({
      where: {
        id,
        store_id: ctx.storeId,
      },
      select: {
        id: true,
        name: true,
        note: true,
        start_at: true,
        end_at: true,
      },
    });

    return event;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};

/**
 * Find promotion details by event ID
 */
export const getEventPromotionDetails = async (
  storeSlug: string,
  eventId: number,
) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);

    const offer = await db.promotionOffer.findFirst({
      where: {
        event_id: eventId,
        event: {
          store_id: ctx.storeId,
        },
      },
      include: {
        buyItems: {
          include: {
            product: true,
          },
        },
        getItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return offer;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};

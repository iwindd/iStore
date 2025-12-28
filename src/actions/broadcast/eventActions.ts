"use server";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export interface EventSelectorItem {
  id: number;
  note: string | null;
  start_at: Date;
  end_at: Date;
}

/**
 * Search events by note for selector dropdown
 */
export const searchEvents = async (
  query: string
): Promise<EventSelectorItem[]> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const events = await db.event.findMany({
      where: {
        store_id: user.store,
        disabled_at: null,
        end_at: { gte: new Date() },
        note: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
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
  id: number
): Promise<EventSelectorItem | null> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const event = await db.event.findFirst({
      where: {
        id,
        store_id: user.store,
      },
      select: {
        id: true,
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

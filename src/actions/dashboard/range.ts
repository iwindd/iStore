"use server";
import { getPath } from "@/router";
import dayjs, { Dayjs } from "dayjs";
import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

export const RangeChange = async (
  start: string | undefined,
  end: string | undefined,
) => {
  const cookie = await cookies();

  if (start) {
    cookie.set({
      name: "dashboard-start",
      value: start,
    });
  }
  if (end) {
    cookie.set({
      name: "dashboard-end",
      value: end,
    });
  }

  if (!start) {
    cookie.delete("dashboard-start");
  }

  if (!end) {
    cookie.delete("dashboard-end");
  }

  const headersList = await headers();
  const storeId = headersList.get("x-store-id");
  const path = storeId ? getPath("overview", { store: storeId }) : "/";
  revalidatePath(path);
};

export const getRange = async (): Promise<[Dayjs | null, Dayjs | null]> => {
  const cookie = await cookies();
  const startStr = cookie.get("dashboard-start")?.value;
  const endStr = cookie.get("dashboard-end")?.value;

  const startDayjs = startStr ? dayjs(startStr).startOf("day") : null;
  const endDayjs = endStr ? dayjs(endStr).endOf("day") : null;

  return [startDayjs, endDayjs];
};

export const getFilterRange = async (
  key: string = "created_at",
  startStr?: string,
  endStr?: string,
) => {
  let start: Dayjs | null = null;
  let end: Dayjs | null = null;

  if (startStr || endStr) {
    start = startStr ? dayjs(startStr).startOf("day") : null;
    end = endStr ? dayjs(endStr).endOf("day") : null;
  } else {
    [start, end] = await getRange();
    if (end) end.endOf("day");
  }

  return {
    [key]: {
      ...(start && {
        gte: start.toDate(),
      }),
      ...(end && {
        lte: end.toDate(),
      }),
    },
  };
};

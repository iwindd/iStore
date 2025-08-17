"use server";
import { Path } from "@/config/Path";
import dayjs, { Dayjs } from "dayjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const RangeChange = async (
  start: string | undefined,
  end: string | undefined
) => {
  if (start) cookies().set("dashboard-start", start);
  if (end) cookies().set("dashboard-end", end);
  if (!start) cookies().delete("dashboard-start");
  if (!end) cookies().delete("dashboard-end");

  revalidatePath(Path("overview").href)
};

export const getRange = async (): Promise<[Dayjs | null, Dayjs | null]> => {
  const startStr = cookies().get("dashboard-start")?.value;
  const endStr = cookies().get("dashboard-end")?.value;

  const startDayjs = (startStr ? dayjs(startStr).startOf("day") : null)
  const endDayjs = (endStr ? dayjs(endStr).endOf("day") : null)

  return [startDayjs, endDayjs];
};

export const getFilterRange = async (key: string = "created_at") => {
  const [start, end] = await getRange();

  if (start) start;
  if (end) end.endOf("day");

  return {
    [key]: {
      ...(start && {
        gte: start.toDate()
      }),
      ...(end && {
        lte: end.toDate()
      }),
    }
  }
}
import dayjs from "@/libs/dayjs";
import { SortDirection } from "@mui/material";
import { GridFilterModel, GridSortModel } from "@mui/x-data-grid";

import { ConsignmentStatus, StockReceiptStatus } from "@prisma/client";

export const money = (val: number) => {
  try {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(val);
  } catch (error) {
    return 0;
  }
};

export const number = (val: number) => {
  try {
    if (!val) return 0;

    return val.toLocaleString();
  } catch (error) {
    return 0;
  }
};

export const abs = (val: number) => {
  try {
    return Math.abs(val);
  } catch (error) {
    return val;
  }
};

export const absNumber = (val: number) => {
  try {
    return number(abs(val));
  } catch (error) {
    return val;
  }
};

export const date = (
  val: Date,
  options?: {
    withTime?: boolean;
    shortMonth?: boolean;
    shortYear?: boolean;
  }
) => {
  try {
    return new Intl.DateTimeFormat("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "long",
      day: "numeric",
      ...((options?.withTime ?? true)
        ? {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        : {}),
      ...(options?.shortMonth
        ? {
            month: "short",
          }
        : {}),
      ...(options?.shortYear
        ? {
            year: "2-digit",
          }
        : {}),
    }).format(new Date(val));
  } catch (error) {
    console.error(error);
    return "-";
  }
};

/** @Deprecated use date() with options.withTime instead */
export const date2 = (val: Date) => {
  try {
    return new Intl.DateTimeFormat("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(val));
  } catch (error) {
    return "-";
  }
};

export const text = (text: string | undefined, replacer: string = "-") => {
  try {
    if (!text) return replacer;
    if (text.length <= 0) return replacer;
    return text;
  } catch (error) {
    return replacer;
  }
};

export const order = (sorts: GridSortModel) => {
  const orderBy: Record<string, any>[] = [];

  for (const sort of sorts) {
    const keys = sort.field.split(".");
    const direction = sort.sort as SortDirection;

    let nested: any = {};
    let current = nested;

    for (const [index, key] of keys.entries()) {
      if (index === keys.length - 1) {
        current[key] = direction;
      } else {
        current[key] = {};
        current = current[key];
      }
    }

    orderBy.unshift(nested);
  }

  return orderBy;
};

export const filter = (
  filter: GridFilterModel,
  rows: string[],
  include?: (text: string) => any
) => {
  const text = filter?.quickFilterValues?.[0];
  const items = filter.items;
  const currentTime = dayjs();

  if (!text && items.length <= 0) return null;

  return {
    OR: [
      /* TEXT */
      ...(text
        ? [
            ...rows.map((name: string) => ({
              [`${name}`]: {
                contains: filter?.quickFilterValues?.[0],
              },
            })),
            ...(include ? include(text) : []),
          ]
        : []),
      /* ITEMS */
      ...(items.length > 0
        ? items.map((item) => {
            if (item.field == "status") {
              return {
                ["status"]: {
                  ...(item.value === -1
                    ? { ["equals"]: -1 }
                    : item.value === 1
                      ? { ["equals"]: 1 }
                      : item.value === 2
                        ? { ["equals"]: 2 }
                        : { ["equals"]: 0 }),
                },
                ...(item.value == 0
                  ? {
                      ["start"]: {
                        ["gte"]: currentTime.toDate(),
                      },
                    }
                  : item.value == 3
                    ? {
                        ["start"]: { lte: currentTime.toDate() },
                        ["end"]: { gte: currentTime.toDate() },
                      }
                    : item.value == 4
                      ? {
                          ["end"]: { lte: currentTime.toDate() },
                        }
                      : {}),
              };
            } else {
              return {
                [`${item.field}`]: {
                  [`${item.operator}`]: item.value,
                },
              };
            }
          })
        : []),
    ],
  };
};

export const stockReceiptStatus = (status: StockReceiptStatus): string => {
  switch (status) {
    case StockReceiptStatus.CREATING:
      return "กำลังสร้าง...";
    case StockReceiptStatus.DRAFT:
      return "แบบร่าง";
    case StockReceiptStatus.PROCESSING:
      return "กำลังดำเนินการ";
    case StockReceiptStatus.COMPLETED:
      return "เสร็จสิ้นแล้ว";
    case StockReceiptStatus.CANCEL:
      return "ยกเลิกแล้ว";
    default:
      return "ไม่ทราบ";
  }
};

export const consignmentStatus = (status: ConsignmentStatus): string => {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "COMPLETED":
      return "เสร็สิ้นแล้ว";
    case "CANCELLED":
      return "ยกเลิกแล้ว";
    default:
      return "ไม่ทราบ";
  }
};

export const removeWhiteSpace = (text: string): string => {
  return text.replace(/\s+/g, "");
};

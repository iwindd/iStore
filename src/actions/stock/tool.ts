"use server";
import {
  ImportFromMinStockPayload,
  ImportFromStockId,
  ImportPayload,
  ImportType,
} from "@/app/stocks/import";
import { StockItem } from "@/atoms/stock";
import { StockPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { User } from "@/libs/user";

const ImportMinStock = async (
  payload: ImportFromMinStockPayload,
  user: User
): Promise<StockItem[]> => {
  const data = await db.product.findMany({
    where: {
      store_id: user.store,
      stock: {
        lte: payload.product_min_stock
          ? db.product.fields.stock_min
          : payload.value,
      },
      deleted: null
    },
    select: {
      id: true,
      serial: true,
      label: true,
      stock: true,
    },
    take: 50,
    orderBy: {
      sold: "desc"
    }
  });

  return data.map((p) => ({ ...p, payload: 0 })) as StockItem[];
};

const ImportStockId = async (
  payload: ImportFromStockId,
  user: User
): Promise<StockItem[]> => {
  const validated = await db.stock.count({where: {id: payload.id, store_id: user.store}});
  if (!validated) throw Error("not_found_stock");
  const data = await db.stockItem.findMany({
    where: {
      stock_id: payload.id,
      product: {
        deleted: null
      }
    },
    select: {
      changed_by: true,
      product: {
        select: {
          id: true,
          serial: true,
          label: true,
          stock: true,
        }
      }
    },
  });

  return data.map((p) => ({ payload: p.changed_by, ...p.product })) as StockItem[];
};

const ImportToolAction = async (
  payload: ImportPayload
): Promise<ActionResponse<StockItem[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(StockPermissionEnum.CREATE)) throw new Error("Forbidden");
    let resp: StockItem[] = [];

    if (payload.type == ImportType.FromMinStock)
      resp = await ImportMinStock(payload, user);
    if (payload.type == ImportType.FromStockId)
      resp = await ImportStockId(payload, user)

    return { success: true, data: resp };
  } catch (error) {
    return ActionError(error) as ActionResponse<StockItem[]>;
  }
};

export default ImportToolAction;

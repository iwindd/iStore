"use server";
import { CashoutType } from "@/enums/cashout";
import { PurchasePermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { PurchaseSchema, PurchaseValues } from "@/schema/Purchase";

const CreatePurchase = async (
  payload: PurchaseValues
): Promise<ActionResponse<PurchaseValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(PurchasePermissionEnum.CREATE)) throw new Error("Forbidden");
    const validated = PurchaseSchema.parse(payload);
    const totalCost = validated.cost * validated.count;

    await db.order.create({
      data: {
        price: 0,
        cost: totalCost,
        profit: 0 - (totalCost),
        type: CashoutType.PURCHASE,
        note: payload.note,
        text: payload.label,
        store_id: user.store,
        user_store_id: user.userStoreId,
        products: {
          create: [
            {
              serial: "-",
              label: payload.label,
              category: "-",
              price: 0,
              cost: payload.cost,
              count: payload.count,
              overstock: 0,
            }
          ]
        }
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<PurchaseValues>;
  }
};

export default CreatePurchase;

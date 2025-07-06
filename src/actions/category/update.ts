"use server";
import { CategoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { CategorySchema, CategoryValues } from "@/schema/Category";

const UpdateCategory = async (
  payload: CategoryValues,
  id: number
): Promise<ActionResponse<CategoryValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CategoryPermissionEnum.UPDATE)) throw new Error("Forbidden");
    const validated = CategorySchema.parse(payload);
    await db.category.update({
      where: {
        id: id,
        store_id: user.store,
      },
      data: { label: validated.label, overstock: validated.overstock },
    });

    if (payload.active){
      await db.product.updateMany({
        where: {
          category_id: null
        },
        data: {
          category_id: id
        }
      })
    }

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<CategoryValues>;
  }
};

export default UpdateCategory;

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
    const validated = CategorySchema.parse(payload);
    const deleted = await db.category.update({
      where: {
        id: id,
        store_id: user.store,
        creator_id: !user.hasPermission(CategoryPermissionEnum.UPDATE)
          ? user.userStoreId
          : undefined,
      },
      data: { label: validated.label, overstock: validated.overstock },
    });

    if (deleted && payload.active) {
      await db.product.updateMany({
        where: {
          category_id: null,
        },
        data: {
          category_id: id,
        },
      });
    }

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<CategoryValues>;
  }
};

export default UpdateCategory;

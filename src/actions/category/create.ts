"use server";
import { CategoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { CategorySchema, CategoryValues } from "@/schema/Category";

const CreateCategory = async (
  payload: CategoryValues
): Promise<ActionResponse<CategoryValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CategoryPermissionEnum.CREATE)) throw new Error("Forbidden");
    const validated = CategorySchema.parse(payload);
    const category = await db.category.create({
      data: {
        label: validated.label,
        store_id: user.store,
        overstock: validated.overstock,
        user_store_id: user.userStoreId,
      },
    });

    if (payload.active){
      await db.product.updateMany({
        where: {
          category_id: null
        },
        data: {
          category_id: category.id
        }
      })
    }

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<CategoryValues>;
  }
};

export default CreateCategory;

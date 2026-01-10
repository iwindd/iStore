"use server";
import { CategoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { CategorySchema, CategoryValues } from "@/schema/Category";
import { SearchCategory } from "./search";

const CreateCategory = async (
  payload: CategoryValues
): Promise<ActionResponse<SearchCategory>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CategoryPermissionEnum.CREATE))
      throw new Error("Forbidden");
    const validated = CategorySchema.parse(payload);
    const category = await db.category.create({
      data: {
        label: validated.label,
        store_id: user.store,
        overstock: validated.overstock,
        creator_id: user.employeeId,
      },
    });

    if (payload.active) {
      await db.product.updateMany({
        where: {
          category_id: null,
        },
        data: {
          category_id: category.id,
        },
      });
    }

    return {
      success: true,
      data: {
        id: category.id,
        label: category.label,
        overstock: category.overstock,
      },
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<SearchCategory>;
  }
};

export default CreateCategory;

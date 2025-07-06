"use server";
import { CategoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Category } from "@prisma/client";

const DeleteCategory = async (
  id: number
): Promise<ActionResponse<Category>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(CategoryPermissionEnum.DELETE)) throw new Error("Forbidden");
    const data = await db.category.delete({
      where: {
        id: id,
        store_id: user.store,
      },
    });

    return { success: true, data: data };
  } catch (error) {
    return ActionError(error) as ActionResponse<Category>;
  }
};

export default DeleteCategory;

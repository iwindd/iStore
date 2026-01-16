"use server";
import { CategoryPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

const deleteCategory = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const data = await db.category.delete({
      where: {
        id: id,
        store_id: user.store,
        creator_id: user.hasPermission(CategoryPermissionEnum.DELETE)
          ? undefined
          : user.employeeId,
      },
    });

    return { success: true, data: data };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export default deleteCategory;

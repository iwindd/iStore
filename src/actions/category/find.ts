"use server";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export interface FindCategoryResult {
  id: number;
  label: string;
  overstock: boolean;
}

const findCategory = async (
  categoryId: number
): Promise<ActionResponse<FindCategoryResult | null>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const category = await db.category.findUnique({
      where: {
        id: categoryId,
        store_id: user.store,
      },
      select: {
        id: true,
        label: true,
        overstock: true,
      },
    });


    return {
      success: true,
      data: category || null,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<FindCategoryResult>;
  }
};

export default findCategory;

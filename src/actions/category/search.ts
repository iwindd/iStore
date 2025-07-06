"use server";
import { CategoryPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";

export interface SearchCategory {
  id: number;
  label: string;
  overstock: boolean;
}

const SearchCategories = async (
  input: string
): Promise<ActionResponse<SearchCategory[]>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const products = await db.category.findMany({
      take: 5,
      where: {
        OR: [{ label: { contains: input } }],
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
      data: products,
    };
  } catch (error) {
    return ActionError(error) as ActionResponse<SearchCategory[]>;
  }
};

export default SearchCategories;

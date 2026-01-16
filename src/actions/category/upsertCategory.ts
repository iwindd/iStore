"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { CategorySchema, CategoryValues } from "@/schema/Category";

const upsertCategory = async (payload: CategoryValues, id: number = 0) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = CategorySchema.parse(payload);
    const category = await db.$transaction(async (tx) => {
      const category = await tx.category.upsert({
        where: {
          id: id,
        },
        create: {
          label: validated.label,
          store_id: user.store,
          creator_id: user.employeeId,
        },
        update: {
          label: validated.label,
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

      return category;
    });

    return { success: true, data: category };
  } catch (error) {
    console.error("upsertCategory error: ", error);
    return { success: false };
  }
};

export default upsertCategory;

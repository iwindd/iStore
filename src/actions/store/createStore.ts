"use server";

import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { StoreSchema, StoreValues } from "@/schema/Store";

const createStore = async (payload: StoreValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = StoreSchema.parse(payload);

    const result = await db.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: validated,
      });

      const role = await tx.role.create({
        data: {
          label: "ผู้ดูแล",
          is_super_admin: true,
          store_id: store.id,
        },
      });

      await tx.employee.create({
        data: {
          user_id: user.id,
          store_id: store.id,
          role_id: role.id,
        },
      });

      return store;
    });

    return {
      success: true,
      storeId: result.id,
    };
  } catch (error) {
    console.error("createStore error:", error);
    return {
      success: false,
      error: "Failed to create store",
    };
  }
};

export default createStore;

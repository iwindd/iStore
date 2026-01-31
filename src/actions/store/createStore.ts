"use server";

import { GlobalPermissionEnum } from "@/enums/permission";
import db from "@/libs/db";
import { assertGlobalCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getUser } from "@/libs/session";
import { CreateStoreSchema, CreateStoreValues } from "@/schema/Store";

const createStore = async (payload: CreateStoreValues) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const validated = CreateStoreSchema.parse(payload);
    const ctx = await getPermissionContext();
    assertGlobalCan(ctx, GlobalPermissionEnum.STORE_CREATE);

    // Check if slug already exists
    const existingStore = await db.store.findUnique({
      where: { slug: validated.slug },
    });
    if (existingStore) {
      return {
        success: false,
        error: "Slug already exists",
      };
    }

    const result = await db.$transaction(async (tx) => {
      // Create store
      const store = await tx.store.create({
        data: {
          slug: validated.slug,
          name: validated.storeName,
        },
      });

      // Create address if provided
      if (validated.address) {
        const address = await tx.address.create({
          data: {
            sub_district_id: validated.address.subDistrictId,
            address_line: validated.address.addressLine || "",
            zipcode_snapshot: validated.address.zipcodeSnapshot,
          },
        });

        await tx.storeAddress.create({
          data: {
            store_id: store.id,
            address_id: address.id,
            is_main: true,
          },
        });
      }

      // Create default admin role
      const role = await tx.storeRole.create({
        data: {
          name: "เจ้าของกิจการ",
          is_hidden: true,
          store_id: store.id,
          // NOTES: NO need to add permission because the owner global role have store_permission
          // permissions: {
          //   connect: allPermissions.map((p) => ({ id: p.id })),
          //},
        },
      });

      // Assign user as employee with admin role
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
      storeSlug: result.slug,
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

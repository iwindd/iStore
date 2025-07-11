"use server";
import { AccountPermissionEnum } from "@/enums/permission";
import { ActionError, ActionResponse } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { ProfileSchema, ProfileValues } from "@/schema/Profile";

const UpdateProfile = async (
  payload: ProfileValues,
): Promise<ActionResponse<ProfileValues>> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (!user.hasPermission(AccountPermissionEnum.UPDATE)) throw new Error("Forbidden");
    const validated = ProfileSchema.parse(payload);
    await db.user.update({
      where: {
        id: user.store,
      },
      data: {
        name: validated.name,
      },
    });

    return { success: true, data: validated };
  } catch (error) {
    return ActionError(error) as ActionResponse<ProfileValues>;
  }
};

export default UpdateProfile;

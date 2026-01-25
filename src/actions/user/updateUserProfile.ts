"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { ProfileSchema, ProfileValues } from "@/schema/Profile";

const updateUserProfile = async (payload: ProfileValues) => {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  const validated = ProfileSchema.parse(payload);
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      first_name: validated.first_name,
      last_name: validated.last_name,
    },
  });

  return validated;
};

export default updateUserProfile;

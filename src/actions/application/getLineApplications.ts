"use server";

import db from "@/libs/db";

export const getLineApplications = async () => {
  try {
    const applications = await db.lineApplication.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    return applications;
  } catch (error) {
    console.error("Error fetching Line applications:", error);
    return [];
  }
};

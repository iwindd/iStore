"use server";

import db from "@/libs/db";
import { ZipcodeOption } from "./getZipcodes";

export const findZipcode = async (
  id: number,
): Promise<ZipcodeOption | null> => {
  try {
    const zipcode = await db.zipcode.findUnique({
      where: { id },
      include: {
        sub_district: {
          include: {
            district: {
              include: {
                province: true,
              },
            },
          },
        },
      },
    });

    if (!zipcode) return null;

    return {
      id: zipcode.id,
      code: zipcode.code,
      subDistrictName: zipcode.sub_district.name,
      districtName: zipcode.sub_district.district.name,
      provinceName: zipcode.sub_district.district.province.name,
    };
  } catch (error) {
    console.error("findZipcode error:", error);
    return null;
  }
};

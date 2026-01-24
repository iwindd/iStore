"use server";

import db from "@/libs/db";

export interface ZipcodeOption {
  id: number;
  code: string;
  subDistrictName: string;
  districtName: string;
  provinceName: string;
}

const getZipcodes = async (search?: string): Promise<ZipcodeOption[]> => {
  try {
    const zipcodes = await db.zipcode.findMany({
      where: search
        ? {
            OR: [
              { code: { contains: search } },
              { sub_district: { name: { contains: search } } },
              { sub_district: { district: { name: { contains: search } } } },
              {
                sub_district: {
                  district: { province: { name: { contains: search } } },
                },
              },
            ],
          }
        : undefined,
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
      take: 20,
      orderBy: { code: "asc" },
    });

    return zipcodes.map((z) => ({
      id: z.id,
      code: z.code,
      subDistrictName: z.sub_district.name,
      districtName: z.sub_district.district.name,
      provinceName: z.sub_district.district.province.name,
    }));
  } catch (error) {
    console.error("getZipcodes error:", error);
    return [];
  }
};

export default getZipcodes;

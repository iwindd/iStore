"use server";

import db from "@/libs/db";
import { Prisma } from "@prisma/client";

export interface ZipcodeOption {
  id: number;
  code: string;
  subDistrictName: string;
  districtName: string;
  provinceName: string;
}

const getZipcodes = async (search?: string): Promise<ZipcodeOption[]> => {
  try {
    const where: Prisma.ZipcodeWhereInput = {};

    if (search) {
      where.OR = [
        { code: { contains: search } },
        { sub_district: { name: { contains: search } } },
        { sub_district: { district: { name: { contains: search } } } },
        {
          sub_district: {
            district: { province: { name: { contains: search } } },
          },
        },
      ];
    }

    const zipcodes = await db.zipcode.findMany({
      where: where,
      select: {
        id: true,
        code: true,
        sub_district: {
          select: {
            name: true,
            district: {
              select: {
                name: true,
                province: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 20,
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

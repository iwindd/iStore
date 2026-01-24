"use server";

import db from "@/libs/db";

export interface ZipcodeDetails {
  id: number;
  code: string;
  subDistrict: {
    id: number;
    name: string;
    nameEn: string;
  };
  district: {
    id: number;
    name: string;
    nameEn: string;
  };
  province: {
    id: number;
    name: string;
    nameEn: string;
  };
}

const getZipcodeDetails = async (
  zipcodeId: number,
): Promise<ZipcodeDetails | null> => {
  try {
    const zipcode = await db.zipcode.findUnique({
      where: { id: zipcodeId },
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
      subDistrict: {
        id: zipcode.sub_district.id,
        name: zipcode.sub_district.name,
        nameEn: zipcode.sub_district.nameEn,
      },
      district: {
        id: zipcode.sub_district.district.id,
        name: zipcode.sub_district.district.name,
        nameEn: zipcode.sub_district.district.nameEn,
      },
      province: {
        id: zipcode.sub_district.district.province.id,
        name: zipcode.sub_district.district.province.name,
        nameEn: zipcode.sub_district.district.province.nameEn,
      },
    };
  } catch (error) {
    console.error("getZipcodeDetails error:", error);
    return null;
  }
};

export default getZipcodeDetails;

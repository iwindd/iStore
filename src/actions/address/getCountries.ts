"use server";

import db from "@/libs/db";

export interface CountryOption {
  id: number;
  code: string;
  name: string;
  nameEn: string;
}

export const findCountry = async (
  id: number,
): Promise<CountryOption | null> => {
  try {
    const country = await db.country.findUnique({
      where: { id },
    });
    return country;
  } catch (error) {
    console.error("findCountry error:", error);
    return null;
  }
};

export const searchCountries = async (
  query: string,
): Promise<CountryOption[]> => {
  try {
    const countries = await db.country.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query } },
              { nameEn: { contains: query, mode: "insensitive" } },
              { code: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      take: 20,
      orderBy: { name: "asc" },
    });
    return countries;
  } catch (error) {
    console.error("searchCountries error:", error);
    return [];
  }
};

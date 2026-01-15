"use server";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { Prisma } from "@prisma/client";

export type ConsignmentDetail = Prisma.ConsignmentGetPayload<{
  include: {
    products: {
      include: {
        product: true;
      };
    };
  };
}>;

const getConsignment = async (
  id: number
): Promise<ConsignmentDetail | null> => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    return await db.consignment.findUnique({
      where: {
        id,
        store_id: user.store,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getConsignment;

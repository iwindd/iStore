"use server";
import Prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/session";

export async function getHistories(
  page: number,
  size: number,
  search: string,
  sort: [string | null, "asc" | "desc"]
) {
  try {

    const orderBy: any = [{
      id: 'desc'
    }];
    if (sort[0] != null) {
      orderBy.unshift({
        [(sort[0] as string)]: sort[1]
      })
    }

    const session = await getServerSession();
    const histories = await Prisma.$transaction([
      Prisma.order.count({
        where: {
          retail: session?.user.retail as boolean,
          application: session?.user.application as number
        }
      }),
      Prisma.order.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: orderBy,
        where: {
          retail: session?.user.retail as boolean,
          application: session?.user.application as number,
          OR: [
            {
              note: {
                contains: search
              },
            }
          ]
        }
      })
    ])

    return {
      success: true,
      data: histories[1],
      total: histories[0]
    }
  } catch (error) {
    return {
      success: false,
      error: error
    }
  }
}

export async function getHistory(id: number) {
  try {
    const session = await getServerSession();
    const product = await Prisma.order.findFirst({
      where: {
        id: id,
        retail: session?.user.retail as boolean,
        application: session?.user.application as number
      }
    })

    return {
      success: true,
      data: product
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

"use server";
import { StorePermissionEnum } from "@/enums/permission";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Prisma } from "@prisma/client";

type BroadcastWithRelations = Prisma.BroadcastGetPayload<{
  include: {
    event: {
      select: {
        id: true;
        note: true;
        start_at: true;
        end_at: true;
      };
    };
    creator: {
      select: {
        user: {
          select: {
            name: true;
          };
        };
      };
    };
    logs: true;
  };
}>;

export const getBroadcast = async (storeSlug: string, id: number) => {
  try {
    const ctx = await getPermissionContext(storeSlug);
    assertStoreCan(ctx, StorePermissionEnum.BROADCAST_MANAGEMENT);

    const broadcast = await db.broadcast.findFirst({
      where: {
        id,
        store_id: ctx.storeId,
      },
      include: {
        event: {
          select: {
            id: true,
            note: true,
            start_at: true,
            end_at: true,
          },
        },
        creator: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        logs: {
          orderBy: { created_at: "desc" },
          take: 10,
        },
      },
    });

    if (!broadcast) {
      throw new Error("ไม่พบ Broadcast");
    }

    return broadcast as BroadcastWithRelations;
  } catch (error) {
    console.error(error);
    throw ActionError(error);
  }
};

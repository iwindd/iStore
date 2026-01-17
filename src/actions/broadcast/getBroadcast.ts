"use server";
import { ActionError } from "@/libs/action";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
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

export const getBroadcast = async (id: number) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const broadcast = await db.broadcast.findFirst({
      where: {
        id,
        store_id: user.store,
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

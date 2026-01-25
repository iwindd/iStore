import db from "@/libs/db";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { notFound } from "next/navigation";
import { BroadcastProvider } from "./BroadcastContext";

export default async function BroadcastLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; store: string }>;
}) {
  const { id, store: storeSlug } = await params;
  const broadcastId = Number.parseInt(id);

  if (Number.isNaN(broadcastId)) return notFound();

  const ctx = await getPermissionContext(storeSlug);

  const broadcast = await db.broadcast.findFirst({
    where: {
      id: broadcastId,
      store_id: ctx.storeId,
    },
    select: {
      id: true,
      event_id: true,
      title: true,
      message: true,
      image_url: true,
      scheduled_at: true,
      status: true,
    },
  });

  if (!broadcast) return notFound();

  return (
    <BroadcastProvider
      value={{
        ...broadcast,
        image_url: broadcast.image_url || "",
      }}
    >
      {children}
    </BroadcastProvider>
  );
}

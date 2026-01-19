import db from "@/libs/db";
import { getUser } from "@/libs/session";
import { notFound } from "next/navigation";
import { BroadcastProvider } from "./BroadcastContext";

export default async function BroadcastLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const broadcastId = Number.parseInt(id);

  if (Number.isNaN(broadcastId)) return notFound();

  const user = await getUser();
  if (!user) return notFound();

  const broadcast = await db.broadcast.findFirst({
    where: {
      id: broadcastId,
      store_id: user.store,
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

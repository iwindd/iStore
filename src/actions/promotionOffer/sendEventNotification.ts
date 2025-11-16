import db from "@/libs/db";
import lineBot from "@/libs/lineBot";

export const sendEventNotification = async (eventId: number) => {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: {
      title: true,
      description: true,
      start_at: true,
      end_at: true,
    },
  });

  if (!event) {
    throw new Error("event_to_notify_not_found");
  }

  lineBot.pushMessageToAllChat([
    {
      type: "text",
      text: `${event.title}`,
    },
    {
      type: "text",
      text: `${event.description}`,
    },
  ]);
};

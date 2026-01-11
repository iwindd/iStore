import db from "@/libs/db";
import { notFound } from "next/navigation";
import { LineApplicationProvider } from "./LineApplicationContext";

const ApplicationDetailLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const appId = Number.parseInt(id);

  if (Number.isNaN(appId)) {
    return notFound();
  }

  // Currently only supporting LineApplication
  const lineApplication = await db.lineApplication.findUnique({
    where: { id: appId },
  });

  if (!lineApplication) {
    return notFound();
  }

  return (
    <LineApplicationProvider value={lineApplication}>
      {children}
    </LineApplicationProvider>
  );
};

export default ApplicationDetailLayout;

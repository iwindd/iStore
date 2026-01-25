import db from "@/libs/db";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { notFound } from "next/navigation";
import { LineApplicationProvider } from "./LineApplicationContext";

const ApplicationDetailLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; store: string }>;
}) => {
  const { id, store } = await params;
  const appId = Number.parseInt(id);

  if (Number.isNaN(appId)) {
    return notFound();
  }

  const ctx = await getPermissionContext(store);

  // Currently only supporting LineApplication
  const lineApplication = await db.lineApplication.findFirst({
    where: { id: appId, store_id: ctx.storeId! },
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

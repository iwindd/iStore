import getUserGlobalPermission from "@/actions/user/getUserGlobalPermission";
import getUserStorePermission from "@/actions/user/getUserStorePermission";
import db from "@/libs/db";
import { getUser } from "@/libs/session";
import MainLayout from "@/providers/LayoutProvider";
import PermissionProvider from "@/providers/PermissionProvider";
import { notFound } from "next/navigation";

export default async function StoreLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}>) {
  const { store } = await params;
  const user = await getUser();
  if (!user) return notFound();

  const employeeStoreData = await db.employee.findFirst({
    where: {
      user_id: user.id,
      store: {
        slug: store,
      },
    },
    select: {
      id: true,
      store: {
        select: { id: true },
      },
    },
  });

  if (!employeeStoreData) return notFound();

  const globalPermissions = await getUserGlobalPermission();
  const storePermissions = await getUserStorePermission(
    employeeStoreData.id,
    employeeStoreData.store.id,
  );

  return (
    <PermissionProvider
      globalPermissions={globalPermissions}
      storePermissions={storePermissions}
    >
      <MainLayout>{children}</MainLayout>
    </PermissionProvider>
  );
}

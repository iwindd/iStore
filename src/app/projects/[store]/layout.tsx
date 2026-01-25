import db from "@/libs/db";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getUser } from "@/libs/session";
import MainLayout from "@/providers/LayoutProvider";
import PermissionProvider from "@/providers/PermissionProvider";
import StoreProvider from "@/providers/StoreProvider";
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

  const storeData = await db.employee.findFirst({
    where: {
      user_id: user.id,
      store: {
        slug: store,
      },
    },
    select: {
      id: true,
    },
  });

  if (!storeData) return notFound();

  const ctx = await getPermissionContext(store);

  return (
    <PermissionProvider
      globalPermissions={Array.from(ctx.globalPermissions)}
      storePermissions={Array.from(ctx.storePermissions)}
    >
      <StoreProvider>
        <MainLayout storeSlug={store}>{children}</MainLayout>
      </StoreProvider>
    </PermissionProvider>
  );
}

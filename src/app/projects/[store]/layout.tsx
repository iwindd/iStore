import db from "@/libs/db";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
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
  const ctx = await getPermissionContext(store);
  assertStore(ctx);

  const storeData = await db.employee.findFirst({
    where: {
      user_id: ctx.userId,
      store: {
        slug: store,
      },
    },
    select: {
      id: true,
    },
  });

  if (!storeData) return notFound();

  return (
    <PermissionProvider
      globalPermissions={Array.from(ctx.globalPermissions)}
      storePermissions={Array.from(ctx.storePermissions)}
    >
      <MainLayout storeSlug={store}>{children}</MainLayout>
    </PermissionProvider>
  );
}

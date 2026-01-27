import getUserStorePermission from "@/actions/user/getUserStorePermission";
import db from "@/libs/db";
import { assertStore } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
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
      store: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!storeData?.store) return notFound();

  const permissions = await getUserStorePermission(storeData.id, store);

  return (
    <PermissionProvider
      globalPermissions={Array.from(ctx.globalPermissions)}
      storePermissions={Array.from(ctx.storePermissions)}
    >
      <StoreProvider
        preloadedState={{
          project: {
            currentProject: {
              id: storeData.store.id,
              name: storeData.store.name,
              slug: storeData.store.slug,
            },
            permissions: permissions.map((p) => ({
              id: p.id,
              name: p.name,
            })),
          },
        }}
      >
        <MainLayout>{children}</MainLayout>
      </StoreProvider>
    </PermissionProvider>
  );
}

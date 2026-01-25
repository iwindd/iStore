import { PermissionConfig } from "@/config/permissionConfig";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

interface StocksLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}

export default async function StocksLayout({
  children,
  params,
}: Readonly<StocksLayoutProps>) {
  const { store } = await params;
  const ctx = await getPermissionContext(store);
  assertStoreCan(ctx, PermissionConfig.store.stock.createReceipt);

  return <>{children}</>;
}

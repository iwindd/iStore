import { StorePermissionEnum } from "@/enums/permission";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";

interface StocksLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}

export default async function StocksLayout({
  children,
  params,
}: StocksLayoutProps) {
  const { store } = await params;
  const ctx = await getPermissionContext(store);
  assertStoreCan(ctx, StorePermissionEnum.PRODUCT_MANAGEMENT);

  return <>{children}</>;
}

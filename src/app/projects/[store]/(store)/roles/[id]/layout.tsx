import getStoreRole from "@/actions/roles/getStoreRole";
import { RoleProvider } from "./providers/RoleProvider";

interface RoleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: string; id: string }>;
}

export default async function RoleLayout({
  children,
  params,
}: RoleLayoutProps) {
  const { store, id } = await params;
  const roleId = Number.parseInt(id, 10);
  const role = await getStoreRole(store, roleId);

  return (
    <RoleProvider role={role} storeSlug={store}>
      {children}
    </RoleProvider>
  );
}

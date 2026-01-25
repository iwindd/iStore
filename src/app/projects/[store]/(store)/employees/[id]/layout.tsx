import getStoreEmployee from "@/actions/employee/getStoreEmployee";
import { EmployeeProvider } from "./providers/EmployeeProvider";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ store: string; id: string }>;
}

export default async function EmployeeLayout({
  children,
  params,
}: Readonly<EmployeeLayoutProps>) {
  const { store, id } = await params;
  const employeeId = Number.parseInt(id, 10);
  const employee = await getStoreEmployee(store, employeeId);

  return (
    <EmployeeProvider employee={employee} storeSlug={store}>
      {children}
    </EmployeeProvider>
  );
}

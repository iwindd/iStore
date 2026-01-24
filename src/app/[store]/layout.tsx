import MainLayout from "@/providers/LayoutProvider";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}

import { getPath } from "@/router";
import { redirect } from "next/navigation";

export default async function StoreRootPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const paramsData = await params;
  redirect(getPath("projects.store.dashboard", { store: paramsData.store }));
}

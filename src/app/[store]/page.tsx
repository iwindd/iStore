import { redirect } from "next/navigation";

export default async function StoreRootPage({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const paramsData = await params;
  redirect(`/${paramsData.store}/dashboard`);
}

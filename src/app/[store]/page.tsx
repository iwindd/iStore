import { redirect } from "next/navigation";

export default function StoreRootPage({
  params,
}: {
  params: { store: string };
}) {
  redirect(`/${params.store}/dashboard`);
}

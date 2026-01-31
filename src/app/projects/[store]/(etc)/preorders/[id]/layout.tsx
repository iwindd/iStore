import getPreOrderOrderDetail from "@/actions/preorder/getPreOrderOrderDetail";
import { PermissionConfig } from "@/config/permissionConfig";
import App, { Wrapper } from "@/layouts/App";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { getFormatter, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PreOrderOrderProvider } from "./PreOrderOrderContext";

interface PreOrderOrderLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string; store: string }>;
}

const PreOrderOrderLayout = async ({
  children,
  params,
}: PreOrderOrderLayoutProps) => {
  const { id, store } = await params;
  const ctx = await getPermissionContext(store);
  assertStoreCan(ctx, PermissionConfig.store.preorder.getDatatable);
  const t = await getTranslations("PREORDERS.detail");
  const f = await getFormatter();

  const order = await getPreOrderOrderDetail(store, +id);

  if (!order) notFound();

  return (
    <PreOrderOrderProvider value={order}>
      <Wrapper>
        <App.Header>
          <App.Header.Title>
            {t("title", { id: f.number(order.id) })}
          </App.Header.Title>
        </App.Header>
        <App.Main>{children}</App.Main>
      </Wrapper>
    </PreOrderOrderProvider>
  );
};

export default PreOrderOrderLayout;

import getConsignment from "@/actions/consignment/getConsignment";
import App, { Wrapper } from "@/layouts/App";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ConsignmentProvider } from "./ConsignmentContext";

interface ConsignmentLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string; store: string }>;
}

const ConsignmentLayout = async ({
  children,
  params,
}: ConsignmentLayoutProps) => {
  const { id, store } = await params;
  const consignment = await getConsignment(store, +id);
  const t = await getTranslations("CONSIGNMENTS.detail");

  if (!consignment) notFound();

  return (
    <ConsignmentProvider value={consignment}>
      <Wrapper>
        <App.Header>
          <App.Header.Title>{t("title", { id })}</App.Header.Title>
        </App.Header>
        <App.Main>{children}</App.Main>
      </Wrapper>
    </ConsignmentProvider>
  );
};

export default ConsignmentLayout;

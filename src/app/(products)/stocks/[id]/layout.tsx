import App, { Wrapper } from "@/layouts/App";
import db from "@/libs/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { StockProvider } from "./StockContext";

export type StockLayoutValue = Prisma.StockReceiptGetPayload<{
  select: typeof StockLayoutSelect;
}>;

export const StockLayoutSelect = {
  id: true,
  note: true,
  status: true,
  stock_recept_products: {
    select: {
      product_id: true,
      quantity: true,
    },
  },
} satisfies Prisma.StockReceiptSelect;

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const stock = await db.stockReceipt.findFirst({
    where: {
      id: +id,
    },
    select: StockLayoutSelect,
  });

  if (!stock) {
    return notFound();
  }

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>รายการละเอียดสต๊อก</App.Header.Title>
      </App.Header>
      <App.Main>
        <StockProvider value={stock}>{children}</StockProvider>
      </App.Main>
    </Wrapper>
  );
};

export default Layout;

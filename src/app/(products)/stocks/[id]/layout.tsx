import App, { Wrapper } from "@/layouts/App";
import db from "@/libs/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { StockProvider } from "./StockContext";

export type StockLayoutValue = Prisma.StockGetPayload<{
  select: typeof StockLayoutSelect;
}>;

export const StockLayoutSelect = {
  id: true,
  note: true,
  state: true,
  products: {
    select: {
      product_id: true,
      stock_after: true,
      stock_before: true,
    },
  },
} satisfies Prisma.StockSelect;

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const stock = await db.stock.findFirst({
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

import App, { Wrapper } from "@/layouts/App";
import db from "@/libs/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import ProductTabs from "./components/ProductTabs";
import { ProductProvider } from "./ProductContext";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export type ProductLayoutValue = Prisma.ProductGetPayload<{
  select: typeof selectProduct;
}>;

const selectProduct = {
  id: true,
  serial: true,
  label: true,
  price: true,
  cost: true,
  category: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.ProductSelect;

const ProductLayout = async ({ children, params }: ProductLayoutProps) => {
  const { id } = await params;
  const product = await db.product.findFirst({
    where: {
      id: +id,
    },
    select: selectProduct,
  });

  if (!product) notFound();

  return (
    <ProductProvider value={{ ...product }}>
      <Wrapper>
        <App.Header>
          <App.Header.Title>{product.label}</App.Header.Title>
        </App.Header>
        <App.Main>
          <ProductTabs productId={id} />
          {children}
        </App.Main>
      </Wrapper>
    </ProductProvider>
  );
};

export default ProductLayout;

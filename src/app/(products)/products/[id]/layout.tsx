import App, { Wrapper } from "@/layouts/App";
import db from "@/libs/db";
import { notFound } from "next/navigation";
import ProductTabs from "./components/ProductTabs";
import { ProductProvider } from "./ProductContext";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const ProductLayout = async ({ children, params }: ProductLayoutProps) => {
  const { id } = await params;
  const product = await db.product.findFirst({
    where: {
      id: +id,
    },
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

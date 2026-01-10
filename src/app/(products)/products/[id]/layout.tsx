import findProductById from "@/actions/product/findById";
import App, { Wrapper } from "@/layouts/App";
import { notFound } from "next/navigation";
import ProductTabs from "./components/ProductTabs";
import { ProductProvider } from "./ProductContext";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const ProductLayout = async ({ children, params }: ProductLayoutProps) => {
  const { id } = await params;
  const response = await findProductById(+id);

  if (!response.success || !response.data) notFound();

  const product = response.data;

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

import { PermissionConfig } from "@/config/permissionConfig";
import App, { Wrapper } from "@/layouts/App";
import db from "@/libs/db";
import { assertStoreCan } from "@/libs/permission/context";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { Stack } from "@mui/material";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import ProductTabs from "./components/ProductTabs";
import { ProductProvider } from "./ProductContext";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string; store: string }>;
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
  usePreorder: true,
  category: {
    select: {
      id: true,
      label: true,
    },
  },
  stock: {
    select: {
      quantity: true,
      useAlert: true,
      alertCount: true,
    },
  },
} satisfies Prisma.ProductSelect;

const ProductLayout = async ({ children, params }: ProductLayoutProps) => {
  const { id, store } = await params;
  const ctx = await getPermissionContext(store);
  assertStoreCan(ctx, PermissionConfig.store.product.getDetail);

  const product = await db.product.findFirst({
    where: {
      id: +id,
    },
    select: selectProduct,
  });

  if (!product) notFound();

  return (
    <ProductProvider value={product}>
      <Wrapper>
        <App.Header>
          <App.Header.Title>{product.label}</App.Header.Title>
        </App.Header>
        <App.Main>
          <Stack spacing={3}>
            <ProductTabs productId={id} />
            {children}
          </Stack>
        </App.Main>
      </Wrapper>
    </ProductProvider>
  );
};

export default ProductLayout;

"use client";
import { ProductDatatableInstance } from "@/actions/product/getProductDatatable";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { getPath } from "@/router";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductFormDialog from "./ProductFormDialog";
import SearchDialog from "./SearchDialog";

const AddProductDialogTrigger = () => {
  const t = useTranslations("PRODUCTS");
  const [product, setProduct] = useState<ProductDatatableInstance | null>(null);
  const [isSearch, setIsSearch] = useState<boolean>(true);
  const { user } = useAuth();
  const dialogInfo = useDialog();
  const router = useRouter();

  const onOpen = () => {
    setIsSearch(true);
    dialogInfo.handleOpen();
  };

  const onClose = () => {
    setProduct(null);
    setIsSearch(true);
    dialogInfo.handleClose();
  };

  const onSubmit = (foundProduct?: ProductDatatableInstance) => {
    if (foundProduct?.id && !foundProduct?.deleted_at) {
      router.push(
        getPath("products.product", { id: foundProduct.id.toString() }),
      );

      return;
    }

    setProduct(foundProduct ?? null);
    setIsSearch(false);
  };

  if (!user) return null;
  if (!user.hasPermission(ProductPermissionEnum.CREATE)) return null;

  const currentDialog = dialogInfo.open
    ? isSearch
      ? "search"
      : "product"
    : "none";

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        color="secondary"
        onClick={onOpen}
        size="small"
      >
        {t("add_button")}
      </Button>

      <SearchDialog
        open={currentDialog === "search"}
        onClose={onClose}
        onSubmit={onSubmit}
      />

      <ProductFormDialog
        open={currentDialog === "product"}
        onClose={onClose}
        product={product}
      />
    </>
  );
};

export { default as ProductFormDialog } from "./ProductFormDialog";
export default AddProductDialogTrigger;

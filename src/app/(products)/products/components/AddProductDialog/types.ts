import { ProductDatatableInstance } from "@/actions/product/getProductDatatable";

export interface AddDialogProps {
  onClose: () => void;
  open: boolean;
}

export interface SearchDialogProps extends AddDialogProps {
  onSubmit: (product?: ProductDatatableInstance) => void;
}

export interface ProductFormDialogProps extends AddDialogProps {
  product: ProductDatatableInstance | null;
}

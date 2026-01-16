import { FindProductByIdResult } from "@/actions/product/findById";
import { DeleteTwoTone } from "@mui/icons-material";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

export interface ProductTableRow {
  product: FindProductByIdResult;
  quantity: number;
}

interface ProductTableProps {
  products: {
    product: { id: number; serial: string; label: string };
    quantity: number;
  }[];
  setProducts: React.Dispatch<React.SetStateAction<ProductTableRow[]>>;
  disabled?: boolean;
}

const ProductTable = ({
  products,
  setProducts,
  disabled,
}: ProductTableProps) => {
  const t = useTranslations("PROMOTIONS.buyXgetY.table");
  const onRemoveProduct = (productId: number) => {
    setProducts((prev) => prev.filter((item) => item.product.id !== productId));
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t("serial")}</TableCell>
          <TableCell>{t("product")}</TableCell>
          <TableCell align="right">{t("quantity")}</TableCell>
          <TableCell align="right">{t("remove")}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={4}>
              <Typography color="text.secondary" align="center">
                {t("empty")}
              </Typography>
            </TableCell>
          </TableRow>
        )}
        {products.map((p) => {
          return (
            <TableRow key={p.product.id}>
              <TableCell>{p.product.serial}</TableCell>
              <TableCell>{p.product.label}</TableCell>
              <TableCell align="right">{p.quantity}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={onRemoveProduct.bind(null, p.product.id)}
                  disabled={disabled}
                >
                  <DeleteTwoTone />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductTable;

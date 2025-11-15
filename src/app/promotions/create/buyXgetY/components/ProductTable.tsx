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
import { ProductTableRow } from "../../../create/buyXgetY/page";

interface ProductTableProps {
  products: {
    product: { id: number; serial: string; label: string };
    quantity: number;
  }[];
  setProducts: React.Dispatch<React.SetStateAction<ProductTableRow[]>>;
}

const ProductTable = ({ products, setProducts }: ProductTableProps) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>รหัส</TableCell>
          <TableCell>สินค้า</TableCell>
          <TableCell align="right">จำนวน</TableCell>
          <TableCell align="right">ลบ</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={4}>
              <Typography color="text.secondary" align="center">
                ยังไม่มีรายการ
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
                  onClick={() => {
                    setProducts((prev) =>
                      prev.filter((item) => item.product.id !== p.product.id)
                    );
                  }}
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

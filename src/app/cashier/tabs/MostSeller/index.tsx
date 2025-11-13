"use client";
import fetchMostSoldProducts from "@/actions/product/fetchMostSoldProducts";
import Loading from "@/components/loading";
import { useAppDispatch } from "@/hooks";
import { addProductToCartById } from "@/reducers/cartReducer";
import { AddTwoTone } from "@mui/icons-material";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

const MostSellerTab = () => {
  const dispatch = useAppDispatch();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mostSoldProducts"],
    queryFn: async () => await fetchMostSoldProducts(),
  });

  if (isLoading || !products) {
    return <Loading centered m={5} />;
  }

  if (error) {
    return <Typography>เกิดข้อผิดพลาดในการโหลดข้อมูล</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>รหัสสินค้า</TableCell>
            <TableCell>ชื่อสินค้า</TableCell>
            <TableCell>จำนวนสินค้าในสต๊อก</TableCell>
            <TableCell align="right">จัดการ</TableCell>
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
          {products.map((product) => {
            return (
              <TableRow key={product.id}>
                <TableCell>{product.serial}</TableCell>
                <TableCell>
                  <Stack>
                    {product.label}
                    {product.category && (
                      <Typography variant="caption" color={"text.secondary"}>
                        ประเภท: {product.category.label}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    {product.stock} รายการ
                    {product.category?.overstock && (
                      <Typography variant="caption" color={"text.secondary"}>
                        (สามารถค้างสินค้าได้)
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => dispatch(addProductToCartById(product.id))}
                  >
                    <AddTwoTone />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MostSellerTab;

"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";

type HistoryProductTableProps = {
  products: {
    total: number;
    cost: number;
    profit: number;
    product: {
      category: {
        id: number;
        created_at: Date;
        updated_at: Date;
        store_id: string;
        creator_id: number | null;
        label: string;
        overstock: boolean;
      } | null;
      serial: string;
      label: string;
    };
    count: number;
    id: number;
    note: string | null;
  }[];
};

export function HistoryProductTable({
  products,
}: Readonly<HistoryProductTableProps>): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="รายการสินค้า" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>รหัสสินค้า</TableCell>
              <TableCell>ชื่อสินค้า</TableCell>
              <TableCell>ประเภทสินค้า</TableCell>
              <TableCell>ราคา</TableCell>
              <TableCell>ต้นทุน</TableCell>
              <TableCell>กำไร</TableCell>
              <TableCell>จำนวน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => {
              return (
                <TableRow
                  key={p.id}
                >
                  <TableCell>{p.product.serial}</TableCell>
                  <TableCell>{p.product.label}</TableCell>
                  <TableCell>{p.product.category?.label}</TableCell>
                  <TableCell>{p.total.toLocaleString()} ฿</TableCell>
                  <TableCell>{p.cost.toLocaleString()} ฿</TableCell>
                  <TableCell>{p.profit.toLocaleString()} ฿</TableCell>
                  <TableCell>{p.count.toLocaleString()} รายการ</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

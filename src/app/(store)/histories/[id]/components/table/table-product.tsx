"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { OrderProduct } from "@prisma/client";

export interface HistoryProductTableProps {
  products: OrderProduct[];
}

export function HistoryProductTable({
  products,
}: HistoryProductTableProps): React.JSX.Element {
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
                  className={p.overstock ? "bg-red-100" : ""}
                >
                  <TableCell>{p.serial}</TableCell>
                  <TableCell>{p.label}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.price.toLocaleString()} ฿</TableCell>
                  <TableCell>{p.cost.toLocaleString()} ฿</TableCell>
                  <TableCell>{(p.price - p.cost).toLocaleString()} ฿</TableCell>
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

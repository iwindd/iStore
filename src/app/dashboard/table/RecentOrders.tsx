"use client";
import { useMenu } from "@/hooks/use-menu";
import * as formatter from "@/libs/formatter";
import { getPath } from "@/router";
import { ArrowOutward, ArrowRightTwoTone } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Order } from "@prisma/client";
import { default as Link, default as RouterLink } from "next/link";
import * as React from "react";

export interface RecentOrderTableProps {
  orders: Order[];
  sx?: SxProps;
}

export function RecentOrderTable({
  orders = [],
  sx,
}: RecentOrderTableProps): React.JSX.Element {
  const filters = orders.slice(0, 7);
  const invoiceMenu = useMenu<HTMLButtonElement>();
  const [invoice, setInvoice] = React.useState<Order | null>(null);

  const onMenuClick = (
    order: Order,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {};

  return (
    <Card sx={sx}>
      <CardHeader title="ออเดอร์ล่าสุด" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>วันทำรายการ</TableCell>
              <TableCell>หมายเหตุ</TableCell>
              <TableCell>รวม</TableCell>
              <TableCell>เครื่องมือ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filters.map((order) => {
              return (
                <TableRow hover key={order.id}>
                  <TableCell>#{formatter.number(order.id)}</TableCell>
                  <TableCell>{formatter.date(order.created_at)}</TableCell>
                  <TableCell>{formatter.text(order.note)}</TableCell>
                  <TableCell>{formatter.money(order.price)}</TableCell>
                  <TableCell>
                    <Tooltip title="ดูรายละเอียด">
                      <Link
                        href={getPath("histories.history", {
                          id: order.id.toString(),
                        })}
                      >
                        <IconButton>
                          <ArrowOutward />
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightTwoTone />}
          size="small"
          variant="text"
          component={RouterLink}
          href={getPath("histories")}
        >
          ดูทั้งหมด
        </Button>
      </CardActions>
    </Card>
  );
}

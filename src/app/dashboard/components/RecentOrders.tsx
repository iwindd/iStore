"use client";
import { getRecentOrders } from "@/actions/dashboard/getRecentOrders";
import * as formatter from "@/libs/formatter";
import { getPath } from "@/router";
import { ArrowRightTwoTone } from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function RecentOrders() {
  const { data: latestOrders, isLoading } = useQuery({
    queryKey: ["latest-orders"],
    queryFn: getRecentOrders,
  });

  return (
    <Card sx={{ height: "100%" }}>
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
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? new Array(5).fill(0).map(() => {
                  return (
                    <TableRow hover key={crypto.randomUUID()}>
                      <TableCell>
                        <Skeleton variant="text" width="60%" height={55} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="60%" height={55} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="60%" height={55} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="60%" height={55} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width="60%" height={55} />
                      </TableCell>
                    </TableRow>
                  );
                })
              : latestOrders?.map((order) => {
                  return (
                    <TableRow hover key={order.id} sx={{ height: 55 }}>
                      <TableCell>#{formatter.number(order.id)}</TableCell>
                      <TableCell>{formatter.date(order.created_at)}</TableCell>
                      <TableCell>
                        {formatter.text(order.note || undefined)}
                      </TableCell>
                      <TableCell>
                        {formatter.money(order.total as any)}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="inherit"
                          size="small"
                          variant="text"
                          component={Link}
                          href={getPath("histories.history", {
                            id: order.id.toString(),
                          })}
                        >
                          ดูรายละเอียด
                        </Button>
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
          component={Link}
          href={getPath("histories")}
        >
          ดูทั้งหมด
        </Button>
      </CardActions>
    </Card>
  );
}

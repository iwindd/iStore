"use client";
import { getRecentOrders } from "@/actions/dashboard/getRecentOrders";
import { useRoute } from "@/hooks/use-route";
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
import { useFormatter, useNow, useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

export function RecentOrders() {
  const t = useTranslations("DASHBOARD.recent_orders");
  const f = useFormatter();
  const now = useNow();
  const params = useParams<{ store: string }>();
  const route = useRoute();
  const { data: latestOrders, isLoading } = useQuery({
    queryKey: ["latest-orders", params.store],
    queryFn: () => getRecentOrders(params.store),
  });

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title={t("title")} />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("headers.id")}</TableCell>
              <TableCell>{t("headers.date")}</TableCell>
              <TableCell>{t("headers.note")}</TableCell>
              <TableCell>{t("headers.total")}</TableCell>
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
                      <TableCell>#{f.number(order.id)}</TableCell>
                      <TableCell>
                        {f.relativeTime(order.created_at, now)}
                      </TableCell>
                      <TableCell>{order.note || "-"}</TableCell>
                      <TableCell>
                        {f.number(+order.total, "currency")}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="inherit"
                          size="small"
                          variant="text"
                          component={Link}
                          href={route.path("projects.store.histories.history", {
                            id: order.id.toString(),
                          })}
                        >
                          {t("view_details")}
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
          href={route.path("projects.store.histories")}
        >
          {t("view_all")}
        </Button>
      </CardActions>
    </Card>
  );
}

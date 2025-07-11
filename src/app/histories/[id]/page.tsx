"use server";
import { Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { notFound } from "next/navigation";
import React from "react";
import { HistoryProductTable } from "./components/table/table-product";
import { NoteCard } from "./components/card/NoteCard";
import * as ff from "@/libs/formatter";
import { PriceCard } from "./components/card/PriceCard";
import { CostCard } from "./components/card/CostCard";
import { ProfitCard } from "./components/card/ProfitCard";
import GetHistory from "@/actions/order/find";
import ReceiptController from "./components/receipt-controller";
import { getServerSession } from "@/libs/session";

const History = async ({ params }: { params: { id: string } }) => {
  const history = await GetHistory(Number(params.id));
  const session = await getServerSession();

  if (!history.success || !session) throw new Error("ERROR");
  if (!history.data) return notFound();

  const data = history.data;
  const address = session.user.address;
  const addressText = session.user.address ? `${address?.province} ${address?.area} ${address?.district} ${address?.address} ${address?.postalcode}` : "ไม่ทราบที่อยู่";
  const cashoutBy = data?.user_store?.user ? data.user_store.user.name : "ไม่ทราบชื่อผู้ทำรายการ";

  return (
    <Grid container spacing={1}>
      <Grid lg={12} md={12} xs={12}>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <Stack  sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">ประวัติการทำรายการ</Typography>
            <Typography variant="caption">คิดเงินโดย: {cashoutBy}</Typography>
          </Stack>
          <>
            <ReceiptController items={data.products} name={session.user.name} address={addressText} left={ff.date(data.created_at)} right={`No.${data.id}`}  />
          </>
        </Stack>
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <NoteCard sx={{ height: "100%" }} value={ff.text(data.note)} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <PriceCard
          sx={{ height: "100%" }}
          value={ff.money(data.price) as string}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <CostCard
          sx={{ height: "100%" }}
          value={ff.money(data.cost) as string}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <ProfitCard
          sx={{ height: "100%" }}
          value={ff.money(data.profit) as string}
        />
      </Grid>
      <Grid xs={12}>
        <HistoryProductTable products={data.products} />
      </Grid>
    </Grid>
  );
};

export default History;

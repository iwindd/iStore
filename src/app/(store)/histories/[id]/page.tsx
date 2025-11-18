"use server";
import GetHistory from "@/actions/order/find";
import * as ff from "@/libs/formatter";
import { getServerSession } from "@/libs/session";
import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { notFound } from "next/navigation";
import { CostCard } from "./components/card/CostCard";
import { NoteCard } from "./components/card/NoteCard";
import { PriceCard } from "./components/card/PriceCard";
import { ProfitCard } from "./components/card/ProfitCard";
import { HistoryProductTable } from "./components/table/table-product";

const History = async ({ params }: { params: { id: string } }) => {
  const history = await GetHistory(Number(params.id));
  const session = await getServerSession();

  if (!history.success || !session) throw new Error("ERROR");
  if (!history.data) return notFound();

  const data = history.data;
  const address = session.user.address;
  const addressText = session.user.address
    ? `${address?.province} ${address?.area} ${address?.district} ${address?.address} ${address?.postalcode}`
    : "ไม่ทราบที่อยู่";
  const cashoutBy = data?.creator?.user
    ? data.creator.user.name
    : "ไม่ทราบชื่อผู้ทำรายการ";

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <Stack sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">ประวัติการทำรายการ</Typography>
            <Typography variant="caption">คิดเงินโดย: {cashoutBy}</Typography>
            <Typography variant="caption">
              วันที่ทำรายการ: {ff.date(data.created_at)}
            </Typography>
          </Stack>
          <>
            {/* TODO */}
            {/* <ReceiptController items={data.products} name={session.user.name} address={addressText} left={ff.date(data.created_at)} right={`No.${data.id}`}  /> */}
          </>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <NoteCard sx={{ height: "100%" }} value={ff.text(data.note)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <PriceCard
          sx={{ height: "100%" }}
          value={ff.money(data.price) as string}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CostCard
          sx={{ height: "100%" }}
          value={ff.money(data.cost) as string}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <ProfitCard
          sx={{ height: "100%" }}
          value={ff.money(data.profit) as string}
        />
      </Grid>
      <Grid size={12}>
        <HistoryProductTable products={data.products} />
      </Grid>
    </Grid>
  );
};

export default History;

"use server";
import getHistoryDetail from "@/actions/order/getHistoryDetail";
import * as ff from "@/libs/formatter";
import { getServerSession } from "@/libs/session";
import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { notFound } from "next/navigation";
import { CostCard } from "./components/card/CostCard";
import { NoteCard } from "./components/card/NoteCard";
import { PriceCard } from "./components/card/PriceCard";
import { ProfitCard } from "./components/card/ProfitCard";
import HistoryTabs from "./components/HistoryTabs";

const History = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const history = await getHistoryDetail(+id);
  const session = await getServerSession();

  if (!history) return notFound();

  const address = session?.user.address;
  const addressText = session?.user.address
    ? `${address?.province} ${address?.area} ${address?.district} ${address?.address} ${address?.postalcode}`
    : "ไม่ทราบที่อยู่";
  const cashoutBy = history?.creator?.user.name || "ไม่ทราบชื่อผู้ทำรายการ";

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <Stack sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">ประวัติการทำรายการ</Typography>
            <Typography variant="caption">คิดเงินโดย: {cashoutBy}</Typography>
            <Typography variant="caption">
              วันที่ทำรายการ: {ff.date(history.created_at)}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <NoteCard sx={{ height: "100%" }} value={history.note || "ไม่ระบุ"} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <PriceCard
          sx={{ height: "100%" }}
          value={ff.money(history.total.toNumber()) as string}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CostCard
          sx={{ height: "100%" }}
          value={ff.money(history.cost.toNumber()) as string}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <ProfitCard
          sx={{ height: "100%" }}
          value={ff.money(history.profit.toNumber()) as string}
        />
      </Grid>
      <Grid size={12}>
        <HistoryTabs orderId={history.id} />
      </Grid>
    </Grid>
  );
};

export default History;

"use server";
import getHistoryDetail from "@/actions/order/getHistoryDetail";
import * as ff from "@/libs/formatter";
import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { CostCard } from "./components/card/CostCard";
import { NoteCard } from "./components/card/NoteCard";
import { PriceCard } from "./components/card/PriceCard";
import { ProfitCard } from "./components/card/ProfitCard";
import HistoryTabs from "./components/HistoryTabs";

const History = async ({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) => {
  const { id, store } = await params;
  const history = await getHistoryDetail(store, +id);
  const t = await getTranslations("HISTORIES.detail");

  if (!history) return notFound();

  const cashoutBy = history?.creator?.user
    ? `${history?.creator?.user.first_name} ${history?.creator?.user.last_name}`
    : t("unknown_name");

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Stack direction="row" spacing={3} alignItems={"center"}>
          <Stack sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">{t("title")}</Typography>
            <Typography variant="caption">
              {t("cashout_by", { name: cashoutBy })}
            </Typography>
            <Typography variant="caption">
              {t("action_date", { date: ff.date(history.created_at) })}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <NoteCard
          sx={{ height: "100%" }}
          value={history.note || t("not_specified")}
        />
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

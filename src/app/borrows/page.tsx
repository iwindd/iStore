"use server";
import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import BorrowDatatable from "./components/datatable";
import GetBorrowStats from "@/actions/borrow/stats";
import AddController from "./components/add-controller";

const Borrows = async () => {
  const data = { progress: 0, success: 0, cancel: 0, all: 0 };

  try {
    const resp = await GetBorrowStats();
    if (resp.success) {
      const stats = resp.data;
      const all = stats.length;
  
      data.progress =
        (stats.filter((i) => i.status == "PROGRESS").length / all) * 100;
      data.success =
        (stats.filter((i) => i.status == "SUCCESS").length / all) * 100;
      data.cancel =
        (stats.filter((i) => i.status == "CANCEL").length / all) * 100;
    };
  } catch (error) {
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">การเบิก</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          ></Stack>
        </Stack>
        <>
          <AddController />
        </>
      </Stack>
      <Grid container spacing={1}>
        <Grid xs={12}>
          <BorrowDatatable />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Borrows;

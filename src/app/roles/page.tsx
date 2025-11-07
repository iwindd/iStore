import { Stack, Typography } from "@mui/material";
import AddRoleController from "./components/add-controller";
import RoleDatatable from "./components/datatable";

const Roles = () => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">ตำแหน่ง</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          ></Stack>
        </Stack>
        <>
          <AddRoleController />
        </>
      </Stack>
      <RoleDatatable />
    </Stack>
  );
};

export default Roles;

import { Stack, Typography } from "@mui/material"
import AddController from "./components/add-controller"
import EmployeeDatatable from "./components/datatable"

const Roles = async () => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">พนักงาน</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}></Stack>
        </Stack>
        <>
          <AddController/>
        </>
      </Stack>

      <EmployeeDatatable/>
    </Stack>
  )
}

export default Roles
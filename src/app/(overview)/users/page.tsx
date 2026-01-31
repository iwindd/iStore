"use client";

import getUserDatatable from "@/actions/user/getUserDatatable";
import Datatable from "@/components/Datatable";
import App, { Wrapper } from "@/layouts/App";
import { getPath } from "@/router";
import { AddTwoTone } from "@mui/icons-material";
import { Button, Chip, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const t = useTranslations("USERS");
  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("datatable.headers.name"),
      flex: 1,
      valueGetter: (value, row) => `${row.first_name} ${row.last_name}`,
    },
    {
      field: "email",
      headerName: t("datatable.headers.email"),
      flex: 1,
    },
    {
      field: "stores",
      headerName: t("datatable.headers.stores"),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ height: "100%", alignItems: "center" }}
        >
          {params.row.employees?.map((employee: any) => (
            <Chip
              key={employee.store.id}
              label={employee.store.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      ),
    },
    {
      field: "created_at",
      headerName: t("datatable.headers.created_at"),
      width: 200,
      renderCell: (params) =>
        format(new Date(params.value), "dd/MM/yyyy HH:mm"),
    },
  ];

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            component={Link}
            href={getPath("users.new")}
            variant="contained"
            color="secondary"
            size="small"
          >
            {t("create_button")}
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <Datatable
          name="users"
          columns={columns}
          fetch={getUserDatatable}
          height={700}
        />
      </App.Main>
    </Wrapper>
  );
}

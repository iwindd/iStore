"use client";
import { paths } from "@/paths";
import { AddTwoTone } from "@mui/icons-material";
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import DatagridBusiness from "./components/datagrid-business";

const MainPage = () => {
  const { data } = useSession();

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">ธุรกิจของฉัน</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          ></Stack>
        </Stack>
        <>
          <Link href={paths.business_create}>
            <Button startIcon={<AddTwoTone />} variant="contained">
              ธุรกิจใหม่
            </Button>
          </Link>
        </>
      </Stack>

      <DatagridBusiness />
    </Stack>
  );
};

export default MainPage;

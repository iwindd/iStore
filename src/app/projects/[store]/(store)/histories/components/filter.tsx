"use client";

import getHistoryCreators from "@/actions/order/getHistoryCreators";
import { HistoryFilter } from "@/app/[store]/(store)/histories/types";
import {
  ClearAllTwoTone,
  FilterAltTwoTone,
  SearchTwoTone,
} from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React from "react";

interface Creator {
  id: number;
  name: string;
}

interface HistoryFilterProps {
  onFilterChange: (filter: HistoryFilter) => void;
}

const HistoryFilterComponent = ({ onFilterChange }: HistoryFilterProps) => {
  const t = useTranslations("HISTORIES.filter");
  const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(null);
  const [method, setMethod] = React.useState<"CASH" | "BANK" | "">("");
  const [creatorId, setCreatorId] = React.useState<number | null>(null);
  const [selectedCreator, setSelectedCreator] = React.useState<Creator | null>(
    null,
  );
  const [minTotal, setMinTotal] = React.useState<string>("");
  const [maxTotal, setMaxTotal] = React.useState<string>("");
  const [hasNote, setHasNote] = React.useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const params = useParams<{ store: string }>();

  const { data: creators = [] } = useQuery({
    queryKey: ["history-creators"],
    queryFn: () => getHistoryCreators(params.store),
  });

  const handleApplyFilter = () => {
    const filter: HistoryFilter = {};

    if (startDate) {
      filter.startDate = startDate.startOf("day").toISOString();
    }
    if (endDate) {
      filter.endDate = endDate.endOf("day").toISOString();
    }
    if (method) {
      filter.method = method;
    }
    if (creatorId) {
      filter.creatorId = creatorId;
    }
    if (minTotal !== "") {
      filter.minTotal = Number.parseFloat(minTotal);
    }
    if (maxTotal !== "") {
      filter.maxTotal = Number.parseFloat(maxTotal);
    }
    if (hasNote !== null) {
      filter.hasNote = hasNote;
    }

    onFilterChange(filter);
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setMethod("");
    setCreatorId(null);
    setSelectedCreator(null);
    setMinTotal("");
    setMaxTotal("");
    setHasNote(null);
    onFilterChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (startDate || endDate) count++;
    if (method) count++;
    if (creatorId) count++;
    if (minTotal !== "" || maxTotal !== "") count++;
    if (hasNote !== null) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <FilterAltTwoTone color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                {t("title")}
              </Typography>
              {activeCount > 0 && (
                <Chip
                  label={t("active_count", { count: activeCount })}
                  size="small"
                  color="primary"
                />
              )}
            </Stack>
            <Button
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              variant="text"
            >
              {isExpanded ? t("collapse") : t("expand")}
            </Button>
          </Stack>

          {/* Filter Content */}
          {isExpanded && (
            <Grid container spacing={2}>
              {/* Date Range */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  value={startDate}
                  format="DD/MM/YYYY"
                  onChange={(date) => setStartDate(date)}
                  label={t("start_date")}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  disableFuture
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <DatePicker
                  value={endDate}
                  format="DD/MM/YYYY"
                  onChange={(date) => setEndDate(date)}
                  label={t("end_date")}
                  slotProps={{
                    textField: { size: "small", fullWidth: true },
                  }}
                  disableFuture
                />
              </Grid>

              {/* Payment Method */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>{t("method")}</InputLabel>
                  <Select
                    value={method}
                    label={t("method")}
                    onChange={(e) =>
                      setMethod(e.target.value as "CASH" | "BANK" | "")
                    }
                  >
                    <MenuItem value="">{t("all")}</MenuItem>
                    <MenuItem value="CASH">{t("cash")}</MenuItem>
                    <MenuItem value="BANK">{t("bank")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Creator */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  size="small"
                  options={creators}
                  getOptionLabel={(option) => option.name}
                  value={selectedCreator}
                  onChange={(_, newValue) => {
                    setSelectedCreator(newValue);
                    setCreatorId(newValue?.id ?? null);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t("creator")} />
                  )}
                />
              </Grid>

              {/* Total Range */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  label={t("min_total")}
                  type="number"
                  value={minTotal}
                  onChange={(e) => setMinTotal(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">฿</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  label={t("max_total")}
                  type="number"
                  value={maxTotal}
                  onChange={(e) => setMaxTotal(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">฿</InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>

              {/* Has Note */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>{t("has_note")}</InputLabel>
                  <Select
                    value={hasNote === null ? "" : hasNote ? "yes" : "no"}
                    label={t("has_note")}
                    onChange={(e) => {
                      const value = String(e.target.value);
                      if (value === "") {
                        setHasNote(null);
                      } else {
                        setHasNote(value === "yes");
                      }
                    }}
                  >
                    <MenuItem value="">{t("all")}</MenuItem>
                    <MenuItem value="yes">{t("has_note_yes")}</MenuItem>
                    <MenuItem value="no">{t("has_note_no")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Actions */}
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Button
                  variant="contained"
                  startIcon={<SearchTwoTone />}
                  onClick={handleApplyFilter}
                  fullWidth
                >
                  {t("apply")}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ClearAllTwoTone />}
                  onClick={handleClearFilter}
                >
                  {t("clear")}
                </Button>
              </Grid>
            </Grid>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default HistoryFilterComponent;

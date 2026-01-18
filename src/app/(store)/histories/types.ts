export interface HistoryFilter {
  startDate?: string;
  endDate?: string;
  method?: "CASH" | "BANK" | null;
  creatorId?: number | null;
  minTotal?: number | null;
  maxTotal?: number | null;
  hasNote?: boolean | null;
}

"use client";
import HasStorePermission from "@/components/Flagments/HasStorePermission";
import dashboardStatConfig from "@/config/Dashboard/StatConfig";
import { useAppSelector } from "@/hooks";
import {
  setStatsDisplayMode,
  setStatVisibility,
  StatsSettings,
} from "@/reducers/settingsReducer";
import { BarChart, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";

const DrawerStatsSetting = ({
  expanded,
  handleChange,
}: {
  expanded: string | false;
  handleChange: (
    panel: string,
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}) => {
  const t = useTranslations("DASHBOARD.widget_settings");
  const params = useParams<{ store: string }>();
  const dispatch = useDispatch();

  const storeSettings = useAppSelector(
    (state) => state.settings.stores[params.store],
  );
  const displayMode = storeSettings?.stats?.displayMode ?? "auto";
  const visibility = storeSettings?.stats?.visibility ?? {};

  const handleDisplayModeChange = (mode: "auto" | "custom") => {
    dispatch(
      setStatsDisplayMode({
        storeSlug: params.store,
        mode,
      }),
    );
  };

  const handleStatVisibilityChange = (
    stat: keyof StatsSettings["visibility"],
    visible: boolean,
  ) => {
    dispatch(
      setStatVisibility({
        storeSlug: params.store,
        stat,
        visible,
      }),
    );
  };

  return (
    <Accordion
      expanded={expanded === "stats"}
      onChange={handleChange("stats")}
      disableGutters
      elevation={0}
      sx={{
        "&:before": { display: "none" },
        borderRadius: 1,
        mb: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="stats-content"
        id="stats-header"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <BarChart color="primary" />
          <Typography>{t("categories.stats")}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t("categories.stats_description")}
          </Typography>

          {/* Display Mode Select */}
          <FormControl fullWidth size="small">
            <InputLabel id="display-mode-label">
              {t("display_mode.label")}
            </InputLabel>
            <Select
              labelId="display-mode-label"
              value={displayMode}
              label={t("display_mode.label")}
              onChange={(e) => handleDisplayModeChange(e.target.value)}
            >
              <MenuItem value="auto">{t("display_mode.auto")}</MenuItem>
              <MenuItem value="custom">{t("display_mode.custom")}</MenuItem>
            </Select>
          </FormControl>

          {/* Individual Stat Switches (only shown in custom mode) */}
          {displayMode === "custom" && (
            <Stack spacing={1} sx={{ mt: 1 }}>
              {dashboardStatConfig.map((stat) => (
                <HasStorePermission
                  key={stat.name}
                  permission={"permission" in stat ? stat.permission : []}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack>
                      <Typography variant="body2">
                        {t(`stats_visibility.${stat.name}`)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t(`stats_visibility.${stat.name}_description`)}
                      </Typography>
                    </Stack>
                    <Switch
                      size="small"
                      checked={visibility[stat.name] ?? true}
                      onChange={(e) =>
                        handleStatVisibilityChange(stat.name, e.target.checked)
                      }
                    />
                  </Stack>
                </HasStorePermission>
              ))}
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default DrawerStatsSetting;

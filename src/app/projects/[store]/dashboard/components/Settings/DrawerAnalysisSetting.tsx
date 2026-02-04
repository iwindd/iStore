"use client";
import HasStorePermission from "@/components/Flagments/HasStorePermission";
import DASHBOARD_ANALYSIS_CONFIG from "@/config/Dashboard/AnalysisConfig";
import { useAppSelector } from "@/hooks";
import {
  AnalysisSettings,
  setAnalysisDisplayMode,
  setAnalysisVisibility,
} from "@/reducers/settingsReducer";
import { ExpandMore, QueryStats } from "@mui/icons-material";
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

const DrawerAnalysisSetting = ({
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
  const displayMode = storeSettings?.analysis?.displayMode ?? "auto";
  const visibility = storeSettings?.analysis?.visibility ?? {};

  const handleDisplayModeChange = (mode: "auto" | "custom") => {
    dispatch(
      setAnalysisDisplayMode({
        storeSlug: params.store,
        mode,
      }),
    );
  };

  const handleAnalysisVisibilityChange = (
    analysis: keyof AnalysisSettings["visibility"],
    visible: boolean,
  ) => {
    dispatch(
      setAnalysisVisibility({
        storeSlug: params.store,
        analysis,
        visible,
      }),
    );
  };

  return (
    <Accordion
      expanded={expanded === "analysis"}
      onChange={handleChange("analysis")}
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
        aria-controls="analysis-content"
        id="analysis-header"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <QueryStats color="secondary" />
          <Typography>{t("categories.analysis")}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {t("categories.analysis_description")}
          </Typography>

          {/* Display Mode Select */}
          <FormControl fullWidth size="small">
            <InputLabel id="analysis-display-mode-label">
              {t("display_mode.label")}
            </InputLabel>
            <Select
              labelId="analysis-display-mode-label"
              value={displayMode}
              label={t("display_mode.label")}
              onChange={(e) => handleDisplayModeChange(e.target.value)}
            >
              <MenuItem value="auto">{t("display_mode.auto")}</MenuItem>
              <MenuItem value="custom">{t("display_mode.custom")}</MenuItem>
            </Select>
          </FormControl>

          {/* Individual Analysis Switches (only shown in custom mode) */}
          {displayMode === "custom" && (
            <Stack spacing={1} sx={{ mt: 1 }}>
              {DASHBOARD_ANALYSIS_CONFIG.map((item) => {
                return (
                  <HasStorePermission
                    key={item.name}
                    permission={
                      Array.isArray(item.permission)
                        ? item.permission.map((p) => p)
                        : [item.permission]
                    }
                    some={Array.isArray(item.permission)}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack>
                        <Typography variant="body2">
                          {t(`analysis_visibility.${item.name}`)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(`analysis_visibility.${item.name}_description`)}
                        </Typography>
                      </Stack>
                      <Switch
                        size="small"
                        checked={visibility[item.name] ?? true}
                        onChange={(e) =>
                          handleAnalysisVisibilityChange(
                            item.name,
                            e.target.checked,
                          )
                        }
                      />
                    </Stack>
                  </HasStorePermission>
                );
              })}
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default DrawerAnalysisSetting;

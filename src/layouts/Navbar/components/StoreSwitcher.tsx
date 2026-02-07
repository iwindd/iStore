"use client";

import getStoreSwitcher from "@/actions/user/getStoreSwitcher";
import HasGlobalPermission from "@/components/Flagments/HasGlobalPermission";
import { PermissionConfig } from "@/config/permissionConfig";
import { useAppSelector } from "@/hooks";
import { Colorization } from "@/libs/colorization";
import { getPath } from "@/router";
import {
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Store as StoreIcon, // Fallback icon
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const StoreSwitcher = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams<{ store: string }>();
  const open = Boolean(anchorEl);
  const store = useAppSelector((state) => state.project.currentProject);
  const t = useTranslations("COMPONENTS.store_switcher");
  const queryClient = useQueryClient();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateNew = () => handleClose();

  const handleStoreChange = () => {
    queryClient.clear();
  };

  const { data: stores, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getStoreSwitcher(),
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 60 * 60 * 1000,
  });

  const selectedStore = stores?.find((store) => store.slug === params.store);

  return (
    <>
      <Button
        onClick={handleClick}
        disableRipple
        data-open={open}
        sx={{
          color: "text.primary",
          backgroundColor: "transparent",
          borderRadius: 1,
          px: 1,
          py: 0.5,
          textTransform: "none",
          justifyContent: "space-between",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "action.hover",
            borderColor: "text.secondary",
          },
          "&[data-open='true']": {
            backgroundColor: "action.hover",
            borderColor: "text.secondary",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isLoading ? (
            <>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                sx={{ bgcolor: "action.hover" }}
              />
              <Skeleton
                variant="text"
                width={60}
                height={30}
                sx={{ bgcolor: "action.hover" }}
              />
            </>
          ) : (
            <>
              <Avatar
                variant="rounded" // Or 'square' as seen in screenshot mostly
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: Colorization.getStoreBackgroundColor(0),
                  fontSize: 14,
                }}
              >
                {/* If we had an image, we'd put it here. Using first letter or icon for now */}
                <StoreIcon sx={{ fontSize: 16 }} />
              </Avatar>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {selectedStore?.name}
              </Typography>
              <Chip
                label={t("status.opened")}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              />
            </>
          )}
        </Box>

        <KeyboardArrowDownIcon
          sx={{
            color: "text.secondary",
            fontSize: 18,
            marginLeft: "0.5em",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              backgroundImage: "none", // Reset for potential dark mode noise
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {isLoading && (
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={40}
            sx={{ bgcolor: "action.hover" }}
          />
        )}

        {!isLoading &&
          stores?.map((store, index) => (
            <MenuItem
              key={store.id}
              component={Link}
              href={getPath("projects.store.dashboard", { store: store.slug })}
              selected={store.id === selectedStore?.id}
              onClick={handleStoreChange}
              sx={{
                py: 1,
                px: 2,
                gap: 1.5,
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: Colorization.getStoreBackgroundColor(index),
                }}
              >
                <StoreIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <ListItemText
                primary={store.name}
                slotProps={{
                  primary: {
                    variant: "body2",
                    fontWeight: 500,
                  },
                }}
              />
              <Chip
                label={t("status.opened")}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              />
            </MenuItem>
          ))}

        <HasGlobalPermission permission={PermissionConfig.global.createStore}>
          <Divider sx={{ my: 1 }} />

          <MenuItem
            onClick={handleCreateNew}
            component={Link}
            href={getPath("projects.new")}
            sx={{
              py: 1,
              px: 2,
              gap: 1.5,
              color: "text.secondary",
            }}
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t("create_store")}
              slotProps={{
                primary: {
                  variant: "body2",
                  fontWeight: 500,
                },
              }}
            />
          </MenuItem>
        </HasGlobalPermission>
      </Menu>
    </>
  );
};

export default StoreSwitcher;

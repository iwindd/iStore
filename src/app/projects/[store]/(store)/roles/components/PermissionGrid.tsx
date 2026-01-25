"use client";

import { StorePermissionEnum } from "@/enums/permission";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

interface PermissionGridProps {
  value: string[];
  onChange: (permissions: string[]) => void;
  error?: string;
  disabled?: boolean;
}

const PermissionGrid: React.FC<PermissionGridProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const t = useTranslations("ROLES");

  const allPermissions = Object.values(StorePermissionEnum);

  const handleToggle = (permission: string) => {
    const currentIndex = value.indexOf(permission);
    const newPermissions = [...value];

    if (currentIndex === -1) {
      newPermissions.push(permission);
    } else {
      newPermissions.splice(currentIndex, 1);
    }

    onChange(newPermissions);
  };

  return (
    <Card>
      <CardHeader
        title={t("form.permissions_card")}
        subheader={t("form.permissions_helper")}
      />
      <CardContent>
        <FormControl component="div" error={!!error} fullWidth>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {allPermissions.map((permission) => (
              <div key={permission}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={value.includes(permission)}
                      onChange={() => handleToggle(permission)}
                      disabled={disabled}
                      color="primary"
                    />
                  }
                  label={t(
                    `permissions.${permission.replaceAll(".", "-")}.label`,
                  )}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t(
                      `permissions.${permission.replaceAll(".", "-")}.description`,
                    )}
                  </Typography>
                </Box>
              </div>
            ))}
          </Box>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default PermissionGrid;

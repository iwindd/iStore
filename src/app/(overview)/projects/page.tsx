"use client";
import getStoreSwitcher from "@/actions/user/getStoreSwitcher";
import HasGlobalPermission from "@/components/Flagments/HasGlobalPermission";
import { GlobalPermissionEnum } from "@/enums/permission";
import App, { Wrapper } from "@/layouts/App";
import AppHeader from "@/layouts/App/Header";
import { getPath } from "@/router";
import {
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import CreateStoreCard from "./components/CreateStoreCard";

export default function OverviewPage() {
  const t = useTranslations("OVERVIEW");
  const { data, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: getStoreSwitcher,
  });

  return (
    <Wrapper>
      <AppHeader>
        <AppHeader.Title subtitle={t("subtitle")}>{t("title")}</AppHeader.Title>
      </AppHeader>
      <App.Main>
        <Stack spacing={2}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={100} />
            ))
          ) : (
            <>
              <Stack spacing={1}>
                {data?.map((store) => (
                  <Card key={store.id} variant="outlined">
                    <CardActionArea
                      href={getPath("projects.store", { store: store.slug })}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {store.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("store_card.description")}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
              {data?.length === 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {t("empty.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("empty.description")}
                    </Typography>
                  </CardContent>
                </Card>
              )}
              <HasGlobalPermission
                permission={GlobalPermissionEnum.STORE_CREATE}
              >
                <CreateStoreCard />
              </HasGlobalPermission>
            </>
          )}
        </Stack>
      </App.Main>
    </Wrapper>
  );
}

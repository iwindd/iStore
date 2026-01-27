"use client";

import ErrorPage from "@/components/ErrorPage";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NOT_FOUND");

  return (
    <ErrorPage
      code="404"
      title={t("title")}
      description={t("description")}
      buttonText={t("button")}
    />
  );
}

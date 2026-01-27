"use client";

import ErrorPage from "@/components/ErrorPage";
import { useTranslations } from "next-intl";

export default function Forbidden() {
  const t = useTranslations("FORBIDDEN");

  return (
    <ErrorPage
      code="403"
      title={t("title")}
      description={t("description")}
      buttonText={t("button")}
    />
  );
}

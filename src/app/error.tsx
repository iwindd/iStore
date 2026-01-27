"use client";

import ErrorPage from "@/components/ErrorPage";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error_({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const t = useTranslations("INTERNAL_ERROR");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorPage
      code="500"
      title={t("title")}
      description={t("description")}
      buttonText={t("button")}
      onButtonClick={reset}
    />
  );
}

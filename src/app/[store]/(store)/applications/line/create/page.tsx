"use client";

import { createLineApplication } from "@/actions/application/createLineApplication";
import FormLineApplication from "@/components/Forms/Application/FormLineApplication";
import App, { Wrapper } from "@/layouts/App";
import { getPath } from "@/router";
import { LineApplicationSchemaType } from "@/schema/Application";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const LineApplicationCreatePage = () => {
  const t = useTranslations("APPLICATIONS");
  const router = useRouter();

  const handleSubmit = async (data: LineApplicationSchemaType) => {
    try {
      const result = await createLineApplication(data);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
        router.push(getPath("store.applications"));
        return true;
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(t("messages.unknown_error"), { variant: "error" });
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormLineApplication onSubmit={handleSubmit} />
      </App.Main>
    </Wrapper>
  );
};

export default LineApplicationCreatePage;

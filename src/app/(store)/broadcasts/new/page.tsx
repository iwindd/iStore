"use client";
import { createBroadcast } from "@/actions/broadcast/createBroadcast";

import FormBroadcast from "@/components/Forms/Broadcast/FormBroadcast";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import { CreateBroadcastValues } from "@/schema/Broadcast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const BroadcastNewPage = () => {
  const t = useTranslations("BROADCASTS.form");
  const { setBackdrop } = useInterface();
  const [isCreated, setIsCreated] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CreateBroadcastValues) =>
      await createBroadcast(data),
    onMutate: () => {
      setBackdrop(true);
    },
    onSuccess: async () => {
      setIsCreated(true);
      enqueueSnackbar(t("save_success"), { variant: "success" });
      await queryClient.refetchQueries({
        queryKey: ["broadcasts"],
        type: "active",
      });
      router.push(getPath("broadcasts"));
    },
    onError: (error) => {
      console.log("error creating broadcast", error);
      enqueueSnackbar(error.message || t("save_error"), {
        variant: "error",
      });
    },
    onSettled: () => {
      setBackdrop(false);
    },
  });

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("create_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormBroadcast
          isLoading={createMutation.isPending}
          disabled={isCreated}
          onSubmit={createMutation.mutate}
        />
      </App.Main>
    </Wrapper>
  );
};

export default BroadcastNewPage;

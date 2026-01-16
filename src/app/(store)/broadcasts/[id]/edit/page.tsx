"use client";
import { getBroadcast } from "@/actions/broadcast/getBroadcast";

import { updateBroadcast } from "@/actions/broadcast/updateBroadcast";
import FormBroadcast from "@/components/Forms/Broadcast/FormBroadcast";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import { UpdateBroadcastValues } from "@/schema/Broadcast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const BroadcastEditPage = () => {
  const t = useTranslations("BROADCASTS");
  const params = useParams<{ id: string }>();
  const broadcastId = Number.parseInt(params.id);
  const { setBackdrop } = useInterface();
  const [isUpdated, setIsUpdated] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const broadcastQuery = useQuery({
    queryKey: ["broadcast", broadcastId],
    queryFn: () => getBroadcast(broadcastId),
    enabled: !Number.isNaN(broadcastId),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateBroadcastValues) =>
      await updateBroadcast(broadcastId, data),
    onMutate: () => {
      setBackdrop(true);
    },
    onSuccess: async () => {
      setIsUpdated(true);
      enqueueSnackbar(t("form.update_success"), {
        variant: "success",
      });
      await queryClient.refetchQueries({
        queryKey: ["broadcasts"],
        type: "active",
      });
      router.push(getPath("broadcasts"));
    },
    onError: (error) => {
      console.log("error updating broadcast", error);
      enqueueSnackbar(error.message || t("form.save_error"), {
        variant: "error",
      });
    },
    onSettled: () => {
      setBackdrop(false);
    },
  });

  const isLoading = broadcastQuery.isLoading || updateMutation.isPending;

  if (broadcastQuery.isLoading) {
    return (
      <Wrapper>
        <App.Header>
          <App.Header.Title>{t("view.loading")}</App.Header.Title>
        </App.Header>
      </Wrapper>
    );
  }

  if (!broadcastQuery.data) {
    return (
      <Wrapper>
        <App.Header>
          <App.Header.Title>{t("view.not_found")}</App.Header.Title>
        </App.Header>
      </Wrapper>
    );
  }

  const broadcast = broadcastQuery.data;

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>
          {t("form.edit_title")}: {broadcast.title}
        </App.Header.Title>
      </App.Header>
      <App.Main>
        <FormBroadcast
          broadcast={{
            event_id: broadcast.event_id,
            title: broadcast.title,
            message: broadcast.message,
            image_url: broadcast.image_url || "",
            scheduled_at: new Date(broadcast.scheduled_at),
          }}
          isLoading={isLoading}
          disabled={
            isUpdated || !["DRAFT", "SCHEDULED"].includes(broadcast.status)
          }
          onSubmit={updateMutation.mutate}
        />
      </App.Main>
    </Wrapper>
  );
};

export default BroadcastEditPage;

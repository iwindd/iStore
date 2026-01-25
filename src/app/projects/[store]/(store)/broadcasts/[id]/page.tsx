"use client";
import { updateBroadcast } from "@/actions/broadcast/updateBroadcast";
import FormBroadcast from "@/components/Forms/Broadcast/FormBroadcast";
import App, { Wrapper } from "@/layouts/App";
import { CreateBroadcastValues } from "@/schema/Broadcast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useBroadcast } from "./BroadcastContext";

const BroadcastEditPage = () => {
  const t = useTranslations("BROADCASTS");
  const params = useParams<{ store: string }>();
  const broadcast = useBroadcast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: CreateBroadcastValues) => {
      // CreateBroadcastValues is compatible with update payload structure for now
      // typically we might want a specific UpdateSchema but existing pattern suggests similarity
      return await updateBroadcast(params.store, broadcast.id, data);
    },
    onSuccess: async () => {
      enqueueSnackbar(t("form.update_success"), { variant: "success" });
      await queryClient.invalidateQueries({
        queryKey: ["broadcasts"], // Invalidate list
        type: "active",
      });
      // We might want to revalidate the layout?
      // Server actions usually revalidatePath if set up correctly.
    },
    onError: (error) => {
      console.error("Error updating broadcast:", error);
      enqueueSnackbar(t("form.save_error"), { variant: "error" });
    },
  });

  const canEdit = ["DRAFT", "SCHEDULED"].includes(broadcast.status);

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("view.title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormBroadcast
          broadcast={broadcast}
          isLoading={updateMutation.isPending}
          disabled={!canEdit}
          onSubmit={updateMutation.mutate}
        />
      </App.Main>
    </Wrapper>
  );
};

export default BroadcastEditPage;

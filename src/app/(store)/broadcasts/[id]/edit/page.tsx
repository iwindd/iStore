"use client";
import {getBroadcast} from "@/actions/broadcast/getBroadcast";

import {updateBroadcast} from "@/actions/broadcast/updateBroadcast";
import FormBroadcast from "@/components/Forms/Broadcast/FormBroadcast";
import {Path} from "@/config/Path";
import App, {Wrapper} from "@/layouts/App";
import {useInterface} from "@/providers/InterfaceProvider";
import {UpdateBroadcastValues} from "@/schema/Broadcast";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useParams, useRouter} from "next/navigation";
import {enqueueSnackbar} from "notistack";
import {useState} from "react";

const BroadcastEditPage = () => {
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
      enqueueSnackbar("อัปเดตประกาศเรียบร้อยแล้ว!", {
        variant: "success",
      });
      await queryClient.refetchQueries({
        queryKey: ["broadcasts"],
        type: "active",
      });
      router.push(Path("broadcasts").href);
    },
    onError: (error) => {
      console.log("error updating broadcast", error);
      enqueueSnackbar(error.message || "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", {
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
          <App.Header.Title>กำลังโหลด...</App.Header.Title>
        </App.Header>
      </Wrapper>
    );
  }

  if (!broadcastQuery.data) {
    return (
      <Wrapper>
        <App.Header>
          <App.Header.Title>ไม่พบ Broadcast</App.Header.Title>
        </App.Header>
      </Wrapper>
    );
  }

  const broadcast = broadcastQuery.data;

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>แก้ไขประกาศ: {broadcast.title}</App.Header.Title>
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

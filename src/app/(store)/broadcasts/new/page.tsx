"use client";
import { createBroadcast } from "@/actions/broadcast/createBroadcast";

import FormBroadcast from "@/components/Forms/Broadcast/FormBroadcast";
import { Path } from "@/config/Path";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { CreateBroadcastValues } from "@/schema/Broadcast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const BroadcastNewPage = () => {
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
      enqueueSnackbar("สร้างประกาศใหม่เรียบร้อยแล้ว!", { variant: "success" });
      await queryClient.refetchQueries({
        queryKey: ["datatable:broadcasts"],
        type: "active",
      });
      router.push(Path("broadcasts").href);
    },
    onError: (error) => {
      console.log("error creating broadcast", error);
      enqueueSnackbar(error.message || "เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", {
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
        <App.Header.Title>สร้างประกาศใหม่</App.Header.Title>
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

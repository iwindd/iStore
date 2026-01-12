"use client";
import CreatePromotionOffer from "@/actions/promotionOffer/create";
import FormBuyXGetY from "@/components/Forms/Promotions/FormBuyXGetY";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import { AddPromotionOfferValues } from "@/schema/Promotion/Offer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const PromotionOfferCreatePage = () => {
  const { setBackdrop } = useInterface();
  const [isCreated, setIsCreated] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const createPromotionOffer = useMutation({
    mutationFn: async (data: AddPromotionOfferValues) =>
      await CreatePromotionOffer(data),
    onMutate: () => {
      setBackdrop(true);
    },
    onSuccess: async (resp) => {
      setIsCreated(true);
      enqueueSnackbar("บันทึกข้อเสนอเรียบร้อยแล้ว!", { variant: "success" });
      await queryClient.refetchQueries({
        queryKey: ["datatable:promotions"],
        type: "active",
      });
      router.push(getPath("promotions"));
    },
    onError: (error) => {
      console.log("error creating promotion offer", error);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
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
        <App.Header.Title>สร้างข้อเสนอ ซื้อ X แถม Y</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormBuyXGetY
          isLoading={createPromotionOffer.isPending}
          disabled={isCreated}
          onSubmit={createPromotionOffer.mutate}
        />
      </App.Main>
    </Wrapper>
  );
};

export default PromotionOfferCreatePage;

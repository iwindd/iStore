"use client";
import CreatePromotionOffer from "@/actions/promotionOffer/create";
import FormBuyXGetY from "@/components/Forms/Promotions/FormBuyXGetY";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import { AddPromotionOfferValues } from "@/schema/Promotion/Offer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const PromotionOfferCreatePage = () => {
  const t = useTranslations("PROMOTIONS.buyXgetY");
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
    onSuccess: async () => {
      setIsCreated(true);
      enqueueSnackbar(t("save_success"), { variant: "success" });
      await queryClient.refetchQueries({
        queryKey: ["datatable:promotions"],
        type: "active",
      });
      router.push(getPath("promotions"));
    },
    onError: (error) => {
      console.log("error creating promotion offer", error);
      enqueueSnackbar(t("save_error"), {
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

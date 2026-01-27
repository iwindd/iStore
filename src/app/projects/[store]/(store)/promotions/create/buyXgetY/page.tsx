"use client";
import CreatePromotionOffer from "@/actions/promotionOffer/create";
import FormBuyXGetY from "@/components/Forms/Promotions/FormBuyXGetY";
import { useRoute } from "@/hooks/use-route";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddPromotionOfferValues } from "@/schema/Promotion/Offer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

const PromotionOfferCreatePage = () => {
  const t = useTranslations("PROMOTIONS.buyXgetY");
  const { setBackdrop } = useInterface();
  const [isCreated, setIsCreated] = useState(false);
  const route = useRoute();
  const queryClient = useQueryClient();
  const params = useParams<{ store: string }>();

  const createPromotionOffer = useMutation({
    mutationFn: async (data: AddPromotionOfferValues) =>
      await CreatePromotionOffer(params.store, data),
    onMutate: () => {
      setBackdrop(true);
    },
    onSuccess: (data) => {
      setIsCreated(true);
      enqueueSnackbar(t("save_success"), { variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["promotions"],
        type: "active",
      });
      route.push("projects.store.promotions.buyXgetY", {
        id: data?.id.toString(),
      });
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

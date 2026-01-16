"use client";
import UpdatePromotionOffer from "@/actions/promotionOffer/update";
import FormBuyXGetY from "@/components/Forms/Promotions/FormBuyXGetY";
import App, { Wrapper } from "@/layouts/App";
import { useInterface } from "@/providers/InterfaceProvider";
import { UpdatePromotionOfferValues } from "@/schema/Promotion/Offer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useBuyXGetY } from "./ProductContext";

const BuyXGetYPage = () => {
  const t = useTranslations("PROMOTIONS.buyXgetY");
  const promotionOffer = useBuyXGetY();
  const { setBackdrop } = useInterface();
  const queryClient = useQueryClient();

  const updatePromotionOffer = useMutation({
    mutationFn: async (data: UpdatePromotionOfferValues) =>
      await UpdatePromotionOffer(promotionOffer.id, data),
    onMutate: () => {
      setBackdrop(true);
    },
    onSuccess: async () => {
      enqueueSnackbar(t("save_success"), { variant: "success" });
      await queryClient.refetchQueries({
        queryKey: ["datatable:promotions"],
        type: "active",
      });
    },
    onError: (error) => {
      console.log("error update promotion offer", error);
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
        <App.Header.Title>{t("edit_title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormBuyXGetY
          isLoading={false}
          disabled={promotionOffer.disabled_at !== null}
          onSubmit={updatePromotionOffer.mutate}
          buyXgetY={promotionOffer}
        />
      </App.Main>
    </Wrapper>
  );
};

export default BuyXGetYPage;

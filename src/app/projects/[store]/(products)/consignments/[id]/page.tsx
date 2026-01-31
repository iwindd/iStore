"use client";
import confirmConsignment from "@/actions/consignment/updateConsignmentSold";
import ConsignmentForm from "@/components/Forms/Consignment";
import { ConsignmentValues } from "@/schema/Consignment";
import { CashoutInputValues } from "@/schema/Payment";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useConsignment } from "./ConsignmentContext";

const ConsignmentDetailPage = () => {
  const t = useTranslations("CONSIGNMENTS.detail");
  const params = useParams<{ id: string; store: string }>();
  const router = useRouter();
  const id = Number.parseInt(params.id);
  const { consignment } = useConsignment();
  const { enqueueSnackbar } = useSnackbar();

  const confirmConsignmentMutation = useMutation({
    mutationFn: (data: {
      order: CashoutInputValues;
      consignment: ConsignmentValues;
    }) => confirmConsignment(params.store, { ...data, id }),
    onSuccess: () => {
      enqueueSnackbar(t("success"), {
        variant: "success",
      });
      router.refresh();
    },
    onError: () => {
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  return (
    <ConsignmentForm
      consignment={consignment}
      onSubmit={confirmConsignmentMutation.mutate}
      isLoading={confirmConsignmentMutation.isPending}
    />
  );
};

export default ConsignmentDetailPage;

"use client";
import getConsignment, {
  ConsignmentDetail,
} from "@/actions/consignment/getConsignment";
import confirmConsignment from "@/actions/consignment/updateConsignmentSold";
import ConsignmentForm from "@/components/Forms/Consignment";
import App, { Wrapper } from "@/layouts/App";
import { ConsignmentValues } from "@/schema/Consignment";
import { CashoutInputValues } from "@/schema/Payment";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const ConsignmentDetailPage = () => {
  const t = useTranslations("CONSIGNMENTS.detail");
  const params = useParams<{ id: string; store: string }>();
  const router = useRouter();
  const id = Number.parseInt(params.id);
  const [consignment, setConsignment] = useState<ConsignmentDetail | null>(
    null,
  );
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = React.useCallback(async () => {
    const data = await getConsignment(params.store, id);
    if (!data) {
      enqueueSnackbar(t("not_found"), { variant: "error" });
      router.push("/consignments");
      return;
    }
    setConsignment(data);
  }, [id, router, t, enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmConsignmentMutation = useMutation({
    mutationFn: (data: {
      order: CashoutInputValues;
      consignment: ConsignmentValues;
    }) => confirmConsignment(params.store, { ...data, id }),
    onSuccess: () => {
      enqueueSnackbar(t("success"), {
        variant: "success",
      });
      fetchData();
    },
    onError: () => {
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    },
  });

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title", { id })}</App.Header.Title>
      </App.Header>
      <App.Main>
        {consignment && (
          <ConsignmentForm
            consignment={consignment}
            onSubmit={confirmConsignmentMutation.mutate}
            isLoading={confirmConsignmentMutation.isPending}
          />
        )}
      </App.Main>
    </Wrapper>
  );
};

export default ConsignmentDetailPage;

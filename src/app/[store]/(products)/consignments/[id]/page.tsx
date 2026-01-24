"use client";
import getConsignment, {
  ConsignmentDetail,
} from "@/actions/consignment/getConsignment";
import confirmConsignment from "@/actions/consignment/updateConsignmentSold";
import ConsignmentForm from "@/components/Forms/Consignment";
import App, { Wrapper } from "@/layouts/App";
import { ConsignmentValues } from "@/schema/Consignment";
import { CashoutInputValues } from "@/schema/Payment";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const ConsignmentDetailPage = () => {
  const t = useTranslations("CONSIGNMENTS.detail");
  const params = useParams();
  const router = useRouter();
  const id = Number.parseInt(params.id as string);
  const [consignment, setConsignment] = useState<ConsignmentDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const data = await getConsignment(id);
    if (!data) {
      enqueueSnackbar(t("not_found"), { variant: "error" });
      router.push("/consignments");
      return;
    }
    setConsignment(data);
    setLoading(false);
  }, [id, router, t, enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (payload: {
    order: CashoutInputValues;
    consignment: ConsignmentValues;
  }) => {
    setLoading(true);
    const res = await confirmConsignment(id, payload);
    if (res.success) {
      enqueueSnackbar(t("success"), {
        variant: "success",
      });
      fetchData();
    } else {
      enqueueSnackbar(t("error"), {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title", { id })}</App.Header.Title>
      </App.Header>
      <App.Main>
        {consignment && (
          <ConsignmentForm
            consignment={consignment}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        )}
      </App.Main>
    </Wrapper>
  );
};

export default ConsignmentDetailPage;

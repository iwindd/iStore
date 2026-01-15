"use client";
import getConsignment, {
  ConsignmentDetail,
} from "@/actions/consignment/getConsignment";
import confirmConsignment from "@/actions/consignment/updateConsignmentSold";
import ConsignmentForm from "@/components/Forms/Consignment";
import App, { Wrapper } from "@/layouts/App";
import { ConsignmentValues } from "@/schema/Consignment";
import { CashoutInputValues } from "@/schema/Payment";
import { useParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const ConsignmentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const [consignment, setConsignment] = useState<ConsignmentDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    const data = await getConsignment(id);
    if (!data) {
      enqueueSnackbar("ไม่พบข้อมูลการฝากขาย", { variant: "error" });
      router.push("/consignments");
      return;
    }
    setConsignment(data);
    setLoading(false);
  }, [id, router]);

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
      enqueueSnackbar("ทำสำเร็จรายการฝากขายสำเร็จแล้ว!", {
        variant: "success",
      });
      fetchData();
    } else {
      enqueueSnackbar("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง", {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>รายละเอียดการฝากขาย #{id}</App.Header.Title>
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

"use client";

import { createLineApplication } from "@/actions/application/createLineApplication";
import FormLineApplication from "@/components/Forms/Application/FormLineApplication";
import { Path } from "@/config/Path";
import App, { Wrapper } from "@/layouts/App";
import { LineApplicationSchemaType } from "@/schema/Application";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const LineApplicationCreatePage = () => {
  const router = useRouter();

  const handleSubmit = async (data: LineApplicationSchemaType) => {
    try {
      const result = await createLineApplication(data);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
        router.push(Path("applications").href);
        return true;
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(
        "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้งภายหลัง!",
        { variant: "error" }
      );
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ไลน์แอพพลิเคชั่น</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormLineApplication onSubmit={handleSubmit} />
      </App.Main>
    </Wrapper>
  );
};

export default LineApplicationCreatePage;

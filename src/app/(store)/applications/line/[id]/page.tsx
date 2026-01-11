"use client";
import { updateLineApplication } from "@/actions/application/updateLineApplication";
import FormLineApplication from "@/components/Forms/Application/FormLineApplication";
import App, { Wrapper } from "@/layouts/App";
import { LineApplicationSchemaType } from "@/schema/Application";
import { enqueueSnackbar } from "notistack";
import { useApplication } from "./LineApplicationContext";

const ApplicationDetailPage = () => {
  const { application } = useApplication();

  const handleSubmit = async (data: LineApplicationSchemaType) => {
    try {
      const result = await updateLineApplication(application.id, data);
      if (result.success) {
        enqueueSnackbar(result.message, { variant: "success" });
        return true;
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
        return false;
      }
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ", { variant: "error" });
      console.error("Error updating application:", error);
    }
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{application.name}</App.Header.Title>
      </App.Header>
      <App.Main>
        <FormLineApplication
          onSubmit={handleSubmit}
          application={application}
        />
      </App.Main>
    </Wrapper>
  );
};

export default ApplicationDetailPage;

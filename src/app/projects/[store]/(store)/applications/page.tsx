import { getLineApplications } from "@/actions/application/getLineApplications";
import ApplicationClientPage from "./page.client";

const ApplicationPage = async (props: {
  params: Promise<{ store: string }>;
}) => {
  const { store } = await props.params;
  const applications = await getLineApplications(store);

  return <ApplicationClientPage applications={applications} />;
};

export default ApplicationPage;

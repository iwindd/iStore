import { getLineApplications } from "@/actions/application/getLineApplications";
import ApplicationClientPage from "./page.client";

const ApplicationPage = async () => {
  const applications = await getLineApplications();

  return <ApplicationClientPage applications={applications} />;
};

export default ApplicationPage;

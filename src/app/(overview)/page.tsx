import App, { Wrapper } from "@/layouts/App";
import WelcomeCard from "./components/WelcomeCard";

const AppOverviewPage = async () => {
  return (
    <Wrapper>
      <App.Header>
        <WelcomeCard />
      </App.Header>
    </Wrapper>
  );
};

export default AppOverviewPage;

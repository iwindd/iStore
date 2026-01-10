import AppFooter from "./Footer";
import AppHeader from "./Header";
import AppMain from "./Main";

const App = () => {
  throw new Error(
    "Do not use `App` component directly (use `Wrapper` instead)"
  );
};

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

App.Header = AppHeader;
App.Main = AppMain;
App.Footer = AppFooter;

export default App;

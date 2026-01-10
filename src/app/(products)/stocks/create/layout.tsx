"use client";
import App, { Wrapper } from "@/layouts/App";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>สร้างรายการสต๊อก</App.Header.Title>
      </App.Header>
      <App.Main>{children}</App.Main>
    </Wrapper>
  );
};

export default Layout;

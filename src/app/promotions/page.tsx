"use client";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import CreatePromotionModal from "./components/CreatePromotionModal";

const PromotionPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>โปรโมชั่น</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            size="small"
            onClick={() => setIsOpen(true)}
          >
            เพิ่มรายการ
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <div>เนื้อหาข้อเสนอโปรโมชั่น</div>
      </App.Main>

      <CreatePromotionModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </Wrapper>
  );
};

export default PromotionPage;

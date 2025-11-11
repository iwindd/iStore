"use client";
import { Path } from "@/config/Path";
import { ArrowForwardIosTwoTone } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreatePromotionModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [promotionType, setPromotionType] = useState<string>("offer");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch (promotionType) {
      case "offer":
        return router.push(Path("promotions.offer.create").href);
      default:
        console.log("Unknown promotion type");
    }
  };

  const onClose = handleClose;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>สร้างโปรโมชั่นใหม่</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack flexDirection={"column"} spacing={1}>
            <FormControl>
              <InputLabel id="promotion-type">ประเภทโปรโมชั่น</InputLabel>
              <Select
                value={promotionType}
                labelId="promotion-type"
                label="ประเภทโปรโมชั่น"
                onChange={(e) => setPromotionType(e.target.value)}
              >
                <MenuItem value="offer">ข้อเสนอพิเศษ</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" type="button" onClick={onClose}>
          ปิด
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowForwardIosTwoTone />}
          type="submit"
        >
          สร้างโปรโมชั่น
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePromotionModal;

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

const CreateApplicationModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [applicationType, setApplicationType] = useState<string>("line");
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    switch (applicationType) {
      case "line":
        return router.push(Path("applications.create.line").href);
      default:
        console.log("Unknown application type");
    }
  };

  const onClose = handleClose;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle>สร้างแอพพลิเคชั่นใหม่</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 2 }}>
          <Stack flexDirection={"column"} spacing={1}>
            <FormControl>
              <InputLabel id="application-type">ประเภทแอพพลิเคชั่น</InputLabel>
              <Select
                value={applicationType}
                labelId="application-type"
                label="ประเภทแอพพลิเคชั่น"
                onChange={(e) => setApplicationType(e.target.value)}
              >
                <MenuItem value="line">Line</MenuItem>
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
          สร้างแอพพลิเคชั่น
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateApplicationModal;

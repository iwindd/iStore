import { Image } from "@mui/icons-material";
import {
  Alert,
  Button,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ImageCardProps } from "../ImageCard";

const AiTab = (props: ImageCardProps) => {
  return (
    <Stack spacing={2}>
      <Alert color="info">
        อธิบายรูปภาพที่คุณต้องการจะสร้าง
        คุณสามารถเพิ่มรูปอ้างอิงเพื่อให้ได้ผลลัพธ์ที่คุณต้องการ
      </Alert>
      <TextField
        label="อธิบายรูปภาพ"
        fullWidth
        multiline
        rows={4}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        placeholder="อธิบายรูปภาพ..."
      />
      <Stack>
        <InputLabel sx={{ mb: 1 }}>รูปภาพอ้างอิง</InputLabel>
        <Grid container>
          <Grid size={1}>
            <Button
              variant="dashed"
              color="secondary"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                aspectRatio: "1 / 1",
                width: "100%",
              }}
            >
              <Image fontSize="large" color="disabled" />
              <Typography color="text.secondary" variant="button">
                เพิ่ม
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default AiTab;

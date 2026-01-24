import getStoreSwitcher from "@/actions/user/getStoreSwitcher";
import { auth } from "@/auth";
import App, { Wrapper } from "@/layouts/App";
import AppHeader from "@/layouts/App/Header";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  const stores = await getStoreSwitcher();

  return (
    <Wrapper>
      <AppHeader>
        <AppHeader.Title subtitle="เลือกร้านค้าที่ต้องการเข้าใช้งาน">
          เลือกโปรเจกต์
        </AppHeader.Title>
      </AppHeader>
      <App.Main>
        <Stack spacing={2}>
          {stores.map((store) => (
            <Card key={store.id} variant="outlined">
              <CardActionArea href={`/${store.id}/dashboard`}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {store.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    เข้าหน้าแดชบอร์ด
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
          {stores.length === 0 && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  ยังไม่มีร้านค้า
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  โปรดติดต่อผู้ดูแลเพื่อเพิ่มสิทธิ์เข้าร้านค้า
                </Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      </App.Main>
    </Wrapper>
  );
}

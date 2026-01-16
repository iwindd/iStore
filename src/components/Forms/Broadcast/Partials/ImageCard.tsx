import { CreateBroadcastValues } from "@/schema/Broadcast";
import { Card, CardContent, Divider, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import AiTab from "./tabs/AiTab";
import UploadTab from "./tabs/UploadTab";

export type ImageCardProps = {
  form: UseFormReturn<CreateBroadcastValues>;
  disabled?: boolean;
};

const ImageCard = (props: ImageCardProps) => {
  const t = useTranslations("BROADCASTS.form.sections.image.tabs");
  const [tab, setTab] = useState<"ai" | "upload">("ai");

  const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue as "ai" | "upload");
  };

  return (
    <Card>
      <Tabs value={tab} onChange={onTabChange}>
        <Tab label={t("ai")} value={"ai"} sx={{ px: 2 }} />
        <Tab label={t("upload")} value={"upload"} sx={{ px: 2 }} />
      </Tabs>
      <Divider />
      <CardContent>
        {tab === "ai" ? <AiTab {...props} /> : <UploadTab {...props} />}
      </CardContent>
    </Card>
  );
};

export default ImageCard;

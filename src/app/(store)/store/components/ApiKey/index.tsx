"use client";

import GenerateApiKey from "@/actions/store/generateApiKey";
import GetApiKey from "@/actions/store/getApiKey";
import {
  AutorenewTwoTone,
  ContentCopy,
  KeyTwoTone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const ApiKeyPartial = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await GetApiKey();
        if (response.success && response.data) {
          setApiKey(response.data.apiKey);
        }
      } catch (error) {
        console.error("Failed to fetch API key", error);
        enqueueSnackbar("ไม่สามารถโหลดข้อมูลได้", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await GenerateApiKey();
      if (response.success && response.data) {
        setApiKey(response.data.apiKey);
        enqueueSnackbar("สร้าง API Key เรียบร้อยแล้ว", { variant: "success" });
      } else {
        enqueueSnackbar("เกิดข้อผิดพลาดในการสร้าง API Key", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Failed to generate API key", error);
      enqueueSnackbar("เกิดข้อผิดพลาดในการสร้าง API Key", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      enqueueSnackbar("คัดลอก API Key เรียบร้อยแล้ว", { variant: "success" });
    }
  };

  return (
    <Card>
      <CardHeader title="API Key" />
      <Divider />
      <CardContent>
        <Stack
          spacing={2}
          width={{
            xs: "100%",
            sm: "400px",
            md: "500px",
            lg: "600px",
          }}
        >
          {apiKey ? (
            <>
              <TextField
                label="API Key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                disabled
                slotProps={{
                  input: {
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyTwoTone />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={2}>
                          <Tooltip title={showKey ? "ซ่อน" : "แสดง"}>
                            <IconButton
                              onClick={() => setShowKey(!showKey)}
                              edge="end"
                            >
                              {showKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="คัดลอก">
                            <IconButton onClick={handleCopy} edge="end">
                              <ContentCopy />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <div>
                <Button
                  variant="outlined"
                  startIcon={<AutorenewTwoTone />}
                  onClick={handleGenerate}
                  disabled={isLoading}
                  color="warning"
                >
                  สร้างใหม่
                </Button>
              </div>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                ยังไม่มี API Key กรุณาสร้าง API Key เพื่อใช้งาน
              </Typography>
              <div>
                <Button
                  variant="contained"
                  startIcon={<KeyTwoTone />}
                  onClick={handleGenerate}
                  disabled={isLoading}
                  color="primary"
                >
                  สร้าง API Key
                </Button>
              </div>
            </>
          )}
        </Stack>
      </CardContent>
      <Divider />
    </Card>
  );
};

export default ApiKeyPartial;

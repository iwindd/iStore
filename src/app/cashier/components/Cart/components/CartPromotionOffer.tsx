import { MergedPromotionQuantity } from "@/libs/promotion";
import { Paper, Stack, Tooltip, Typography } from "@mui/material";

const CartPromotionOffer = ({
  promotion,
}: {
  promotion: MergedPromotionQuantity;
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1,
        borderStyle: "dashed",
      }}
    >
      <Stack width={"100%"}>
        <Stack direction={"row"} spacing={1}>
          <Stack width={40} justifyContent={"center"}>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 19,
              }}
            >
              {promotion.quantity}
            </Typography>
          </Stack>
          <Stack flex={1} minWidth={0} mr={1}>
            <Typography variant="h6" fontWeight="bold" noWrap sx={{ pr: 1 }}>
              {promotion.data.label}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Tooltip title={"สินค้าแถมฟรีจากโปรโมชั่นประเภท ซื้อ X แถม Y"}>
                <Typography variant="caption" color="warning" noWrap>
                  โปรโมชั่น
                </Typography>
              </Tooltip>
              {promotion.data.serial && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  รหัสสินค้า {promotion.data.serial}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack justifyContent={"center"}>
            <Typography
              variant="h6"
              fontWeight="bold"
              whiteSpace="nowrap"
              color="success.main"
            >
              ฟรี
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CartPromotionOffer;

import Loading from "@/components/loading";
import { useAppSelector } from "@/hooks";
import useRelatedPromotionOffer from "@/hooks/useRelatedPromotionOffer";
import { date } from "@/libs/formatter";
import { CartProduct } from "@/reducers/cartReducer";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const RelatedPromotionOfferTab = () => {
  const cartProducts: CartProduct[] = useAppSelector(
    (state) => state.cart.products
  );

  const { data: relatedPromotionOffers, isLoading } = useRelatedPromotionOffer({
    productIds: cartProducts.map((p) => p.id),
  });

  if (isLoading || !relatedPromotionOffers) {
    return <Loading centered m={5} />;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>สินค้าที่ต้องซื้อ</TableCell>
            <TableCell>สินค้าที่ได้รับ</TableCell>
            <TableCell align="right">หมดอายุ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relatedPromotionOffers.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography color="text.secondary" align="center">
                  ไม่พบโปรโมชั่นที่เกี่ยวข้อง
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {relatedPromotionOffers.map((offer) => {
            return (
              <TableRow key={offer.id}>
                <TableCell>
                  <Stack>
                    {offer.buyItems.map((item) => (
                      <Typography key={item.product.label} variant="subtitle2">
                        {item.product.label} x {item.quantity}
                      </Typography>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    {offer.getItems.map((item) => (
                      <Typography key={item.product.label} variant="subtitle2">
                        {item.product.label} x {item.quantity}
                      </Typography>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {date(offer.event.end_at, {
                    withTime: false,
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RelatedPromotionOfferTab;

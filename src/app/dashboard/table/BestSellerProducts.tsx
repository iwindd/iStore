import { number } from "@/libs/formatter";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export interface OrderProduct {
  id: number;
  serial: string;
  label: string;
  orders: number;
}

interface BestSellerProductsProps {
  products: OrderProduct[];
}

const BestSellerProducts = ({ products }: BestSellerProductsProps) => {
  return (
    <Card>
      <CardHeader title="สินค้าขายดี" />
      <CardContent sx={{ p: 0 }}>
        <List sx={{ width: "100%", px: 2 }}>
          {products.slice(0, 7).map((product) => (
            <ListItem
              key={product.id}
              disableGutters
              disablePadding
              secondaryAction={
                <Chip
                  label={number(product.orders)}
                  size="small"
                  color="primary"
                />
              }
            >
              <ListItemText
                primary={`${product.label}`}
                secondary={`รหัสสินค้า : ${product.serial}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default BestSellerProducts;

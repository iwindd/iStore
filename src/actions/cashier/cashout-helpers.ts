export const getStockInfo = (product: any) => {
  const stock = product.stock?.quantity ?? 0;
  const canOverStock = product.category?.overstock ?? false;
  return { stock, canOverStock };
};

export const validateStock = (
  product: any,
  quantity: number,
  stock: number,
  canOverStock: boolean
) => {
  if (!canOverStock && quantity > stock) {
    throw new Error(`Stock of product "${product.label}" is insufficient.`);
  }
};

export const adjustOfferQuantity = (
  offerQty: number,
  cartQty: number,
  stock: number,
  canOverStock: boolean
) => {
  if (!canOverStock && cartQty + offerQty > stock) {
    return Math.max(0, stock - cartQty);
  }
  return offerQty;
};

export const calculateTotals = (
  product: any,
  quantity: number,
  offerQuantity: number,
  stock: number
) => {
  const totalQuantity = quantity + offerQuantity;
  const discountFromOffer = offerQuantity * product.price;
  const isOverstock = totalQuantity > stock;

  return {
    quantity: totalQuantity,
    totalPrice: product.price * totalQuantity - discountFromOffer,
    discountFromOffer,
    isOverstock,
    overstockCount: isOverstock ? totalQuantity - stock : 0,
  };
};

export const getTotalPrice = (
  products: { totalPrice: number; quantity: number }[]
) => {
  return products.reduce((total, item) => total + item.totalPrice, 0);
};

export const getTotalCost = (
  products: { cost: number; quantity: number }[]
) => {
  return products.reduce((total, item) => total + item.cost * item.quantity, 0);
};

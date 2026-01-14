export class CashoutHelper {
  /**
   * Get total price of products
   * @param products
   * @returns
   */
  static getTotalPrice(products: { total: number }[]) {
    return products.reduce((total, item) => total + item.total, 0);
  }

  /**
   * Get total cost of products
   * @param products
   * @returns
   */
  static getTotalCost(products: { cost: number }[]) {
    return products.reduce((total, item) => total + item.cost, 0);
  }

  /**
   * Get total profit of products
   * @param products
   * @returns
   */
  static getTotalProfit(products: { profit: number }[]) {
    return products.reduce((total, item) => total + item.profit, 0);
  }
}

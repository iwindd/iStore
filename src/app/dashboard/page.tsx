import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { Traffic } from "./charts/traffic";
import { Sales } from "./charts/sales";
import { getServerSession, getUser } from "@/libs/session";
import getOrders from "@/actions/dashboard/getOrders";
import dayjs from "@/libs/dayjs";
import { TotalStat } from "./stats/Stat";
import { AllInbox, AttachMoney, BackHand, Receipt, RotateRight, ShoppingBasket, Warning, Work } from "@mui/icons-material";
import { money, number } from "@/libs/formatter";
import getBorrows from "@/actions/dashboard/getBorrows";
import Range from "./range";
import { getRange } from "@/actions/dashboard/range";
import { Path } from "@/config/Path";
import getProducts from "@/actions/dashboard/getProducts";
import getStocks from "@/actions/dashboard/getStocks";
import { RecentOrderTable } from "./table/RecentOrders";
import BestSellerProducts, { OrderProduct } from "./table/BestSellerProducts";
import { BorrowPermissionEnum, OverStockPermissionEnum, ProductPermissionEnum, PurchasePermissionEnum, StockPermissionEnum } from "@/enums/permission";

const Dashboard = async () => {
  const [startDate, endDate] = await getRange()
  const user = await getUser();
  if (!user) return;
  const storeId = user.store;
  const orders = await getOrders(storeId);  
  const borrows = await getBorrows(storeId);
  const products = await getProducts(storeId);
  const stocks = await getStocks(storeId);
  const totalProfit = orders.reduce((total, item) => total + item.profit, 0);

  // traffic
  const cashoutOrders = orders.filter((order) => order.type == "CASHOUT");
  const trafficToPercent = (length: number) => (length / cashoutOrders.length) * 100;
  const cashOutMethodCash = cashoutOrders.filter((order) => order.method == "CASH");
  const cashOutMethodBank = cashoutOrders.filter((order) => order.method == "BANK");

  const trafficStats = [
    {
      percent: +trafficToPercent(cashOutMethodCash.length).toFixed(0),
      total: cashOutMethodCash.reduce((total, order) => total + (order.price), 0),
    },
    {
      percent: +trafficToPercent(cashOutMethodBank.length).toFixed(0),
      total: cashOutMethodBank.reduce((total, order) => total + (order.price), 0),
    },
  ];

  //data
  const weekSolds = [0, 0, 0, 0, 0, 0, 0];
  orders.map((order) => weekSolds[dayjs(order.created_at).day()]++);
  let overstocks = 0;
  const bestSellers : OrderProduct[] = [];
  orders.map(({products}) => {
    products.map((item) => {
      const index = bestSellers.findIndex(_item => _item.serial == item.serial);
      if (!item.overstock_at && item.overstock > 0) overstocks += item.overstock;
      if (index != -1){
        bestSellers[index].orders += item.count
      }else{
        bestSellers.push({
          id: item.id,
          serial: item.serial,
          label: item.label,
          orders: item.count
        })
      }
    })
  })
  bestSellers.sort((a, b) => b.orders - a.orders);

  return (
    <Grid container spacing={1}>
      <Grid xs={12}><Range savedStart={startDate ? startDate.format() : null} savedEnd={endDate ? endDate.format() : null} /></Grid>
      <Grid lg={3} sm={6} xs={12}><TotalStat href={Path("histories").href} label="ออเดอร์" color="primary" icon={<Receipt/>} value={`${number(orders.length)} รายการ`} /></Grid>
      <Grid lg={3} sm={6} xs={12}><TotalStat label="เงินในระบบ" color="success" icon={<AttachMoney/>} value={`${money(totalProfit)}`} /></Grid>
      {
        user.hasPermission(BorrowPermissionEnum.READ) &&
        (<Grid lg={3} sm={6} xs={12}><TotalStat href={Path("borrows").href} label="การเบิก" color="warning" icon={<BackHand/>} value={`${number(borrows.length)} รายการ`} /></Grid>)
      }
      {
        user.hasPermission(PurchasePermissionEnum.READ) &&
        <Grid lg={3} sm={6} xs={12}><TotalStat href={Path("purchase").href} label="การซื้อ" color="info" icon={<ShoppingBasket/>} value={`${number(orders.filter(b => b.type == "PURCHASE").length)} รายการ`} /></Grid>
      }
      {
        user.hasPermission(OverStockPermissionEnum.READ) &&
        <Grid lg={3} sm={6} xs={12}><TotalStat href={Path("overstocks").href} label="สินค้าค้าง" color="error" icon={<RotateRight/>} value={`${number(overstocks)} รายการ`} /></Grid>
      }
      {
        user.hasPermission(ProductPermissionEnum.READ) &&
        <Grid lg={3} sm={6} xs={12}><TotalStat href={Path("products").href} label="สินค้าใกล้จะหมด" color="warning" icon={<Warning/>} value={`${number(products.filter(p => p.stock <= p.stock_min).length)} รายการ`} /></Grid>
      }
      {
        user.hasPermission(StockPermissionEnum.READ) &&
        <Grid lg={3} sm={6} xs={12}><TotalStat href={Path("stock").href} label="จัดการสต๊อก" color="info" icon={<AllInbox/>} value={`${number(stocks.length)} รายการ`} /></Grid>
      }
      {
        user.hasPermission(ProductPermissionEnum.READ) &&
        <Grid lg={3} sm={6} xs={12}><TotalStat href={Path("products").href} label="สินค้าทั้งหมด" color="primary" icon={<Work/>} value={`${number(products.length)} รายการ`} /></Grid>
      }
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: "ยอดขาย", data: weekSolds },
          ]}
          sx={{ height: "100%" }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic
          chartSeries={trafficStats}
          labels={["เงินสด", "ธนาคาร"]}
          sx={{ height: "100%" }}
        />
      </Grid>
      <Grid lg={8} xs={12}>
        <RecentOrderTable orders={orders} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <BestSellerProducts products={bestSellers.slice(0, 7)}/>
      </Grid>
    </Grid>
  );
};

export default Dashboard;

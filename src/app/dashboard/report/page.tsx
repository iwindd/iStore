"use server";
import getProductOrder from "@/actions/dashboard/getProductOrder";
import { getRange } from "@/actions/dashboard/range";
import dayjs from "dayjs";
import Viewer from "./viewer";

const DashboardReport = async () => {
  const products = await getProductOrder();
  let [startDate, endDate] = await getRange();

  startDate = startDate ? dayjs(startDate) : dayjs().subtract(1, "month");
  endDate = endDate ? dayjs(endDate) : dayjs();

  startDate = startDate.startOf("day");
  endDate = endDate.endOf("day");

  return (
    <div>
      <Viewer
        products={products}
        startDate={startDate.format()}
        endDate={endDate.format()}
      />
    </div>
  );
};

export default DashboardReport;

"use server";
import getProductOrder from "@/actions/dashboard/getProductOrder";
import React from "react";
import { getRange } from "@/actions/dashboard/range";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const Viewer = dynamic(() => import("./viewer"), { ssr: false });

const DashboardReport = async () => {
  const products = await getProductOrder();
  let [startDate, endDate] = await getRange();
  startDate = startDate
    ? typeof startDate === "string"
      ? dayjs(startDate)
      : startDate
    : dayjs().subtract(1, "month");
  endDate = endDate
    ? typeof endDate === "string"
      ? dayjs(endDate)
      : endDate
    : dayjs();

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

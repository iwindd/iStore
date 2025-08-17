"use client";
import { ProductOrder } from "@/actions/dashboard/getProductOrder";
import { DashboardDocument } from "@/app/report/dashboard";
import dynamic from "next/dynamic";
import React from "react";

interface DashboardReportViewerProps {
  products: ProductOrder[];
  startDate: string;
  endDate: string;
}

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const Viewer = (props: DashboardReportViewerProps) => {
  return (
    <PDFViewer width={"100%"} height={"900px"}>
      <DashboardDocument
        products={props.products}
        startDate={props.startDate}
        endDate={props.endDate}
      />
    </PDFViewer>
  );
};

export default Viewer;
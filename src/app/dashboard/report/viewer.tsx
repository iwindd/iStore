"use client";
import { ProductSummary } from "@/actions/dashboard/getOrdersSummary";
import DashboardDocument from "@/documents/DashboardDocument";
import dynamic from "next/dynamic";

interface DashboardReportViewerProps {
  products: ProductSummary[];
  cashTotal: number;
  transferTotal: number;
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
        cashTotal={props.cashTotal}
        transferTotal={props.transferTotal}
        startDate={props.startDate}
        endDate={props.endDate}
      />
    </PDFViewer>
  );
};

export default Viewer;

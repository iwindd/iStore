"use client";
import { ProductSummary } from "@/actions/dashboard/getOrdersSummary";
import { CashoutMethod } from "@/enums/cashout";
import { date2, money, number } from "@/libs/formatter";
import { getBaseUrl } from "@/libs/utils";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "./components/PDFTable";

const domain = getBaseUrl();

Font.register({
  family: "Sarabun",
  fonts: [
    { src: `${domain}/assets/fonts/THSarabun.ttf`, fontStyle: "normal" },
    { src: `${domain}/assets/fonts/THSarabunItalic.ttf`, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Sarabun Bold",
  fonts: [
    { src: `${domain}/assets/fonts/THSarabunBold.ttf`, fontStyle: "normal" },
    {
      src: `${domain}/assets/fonts/THSarabunBoldItalic.ttf`,
      fontStyle: "italic",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "0.5in",
  },
  header: {
    marginBottom: "20px",
  },
  heading: {
    fontFamily: "Sarabun Bold",
    fontSize: 40,
  },
  address: {
    fontFamily: "Sarabun",
    fontStyle: "italic",
    fontSize: 20,
  },
  divider: {
    width: "100%",
    borderBottom: "1px solid black",
  },
  tableRow: {
    borderBottom: "1px solid gray",
    paddingTop: 4,
    paddingBottom: 4,
  },
});

export interface DashboardDocumentProps {
  products: ProductSummary[];
  startDate: string;
  endDate: string;
  cashTotal: number;
  transferTotal: number;
}

const Divider = ({ fixed }: { fixed?: boolean }) => {
  return <View fixed={fixed} style={styles.divider}></View>;
};

const DashboardDocument = ({
  products,
  startDate,
  endDate,
  cashTotal,
  transferTotal,
}: DashboardDocumentProps) => {
  const grandTotal = cashTotal + transferTotal;

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.header}>
          <Text style={styles.heading}>รายงานสรุปผลการขาย</Text>
          <Text style={styles.address}>
            ระหว่างวันที่ {date2(dayjs(startDate).toDate())} ถึง{" "}
            {date2(dayjs(endDate).toDate())}
          </Text>
        </View>

        <Divider fixed />

        <Table columns={5} bordered striped>
          <TableHead fixed>
            <TableRow>
              <TableCell colSpan={2}>ชื่อรายการ</TableCell>
              <TableCell align="right">จำนวน</TableCell>
              <TableCell align="right">ยอดขาย</TableCell>
              <TableCell align="right">ประเภท</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => (
              <TableRow key={`${product.id}`} style={styles.tableRow}>
                <TableCell colSpan={2}>{product.label}</TableCell>
                <TableCell align="right">{number(product.count)}</TableCell>
                <TableCell align="right">{money(product.total)}</TableCell>
                <TableCell align="right">
                  {product.method == CashoutMethod.CASH ? "เงินสด" : "โอน"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow style={styles.tableRow}>
              <TableCell colSpan={4}>รวมเงินสด</TableCell>
              <TableCell align="right">{money(cashTotal)}</TableCell>
            </TableRow>
            <TableRow style={styles.tableRow}>
              <TableCell colSpan={4}>รวมเงินโอน</TableCell>
              <TableCell align="right">{money(transferTotal)}</TableCell>
            </TableRow>
            <TableRow style={styles.tableRow}>
              <TableCell colSpan={4}>ยอดรวม</TableCell>
              <TableCell align="right">{money(grandTotal)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Page>
    </Document>
  );
};

export default DashboardDocument;

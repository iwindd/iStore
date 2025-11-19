"use client";
import { ProductOrder } from "@/actions/dashboard/getProductOrder";
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
    alignItems: "center",
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
  text: {
    fontFamily: "Sarabun",
  },
  item: {
    fontFamily: "Sarabun",
  },
  itemHeader: {
    fontFamily: "Sarabun Bold",
  },
  caption: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  table: {
    display: "flex",
    flexDirection: "row",
  },
  itemRow: {
    display: "flex",
    flexDirection: "row",
    marginVertical: "1px",
    borderBottom: "1px solid gray",
    paddingTop: 4,
    paddingBottom: 4,
  },
  row: {
    width: "20%",
    justifyContent: "flex-end",
    flexDirection: "row",
    paddingHorizontal: "5px",
  },
  row2: {
    width: "40%",
    paddingHorizontal: "5px",
  },
  row3: {
    width: "80%",
    paddingHorizontal: "5px",
  },
  divider: {
    width: "100%",
    borderBottom: "1px solid black",
  },
  wrapper: {
    marginTop: "20px",
    alignItems: "center",
  },
  heading2: {
    fontFamily: "Sarabun",
    fontSize: 20,
  },
});

export interface DashboardDocumentProps {
  products: ProductOrder[];
  startDate: string;
  endDate: string;
}

const Divider = ({ fixed }: { fixed?: boolean }) => {
  return <View fixed={fixed} style={styles.divider}></View>;
};

const DashboardDocument = ({
  products,
  startDate,
  endDate,
}: DashboardDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.heading}>สรุปผลการขาย</Text>
          <Text style={styles.address}>
            ระหว่างวันที่ {date2(dayjs(startDate).toDate())} ถึง{" "}
            {date2(dayjs(endDate).toDate())}
          </Text>
        </View>
        <Divider fixed />
        <View style={styles.table} fixed>
          <View style={styles.row2}>
            <Text wrap={false} style={styles.itemHeader}>
              ชื่อรายการ
            </Text>
          </View>
          <View style={styles.row}>
            <Text wrap={false} style={styles.itemHeader}>
              ราคา
            </Text>
          </View>
          <View style={styles.row}>
            <Text wrap={false} style={styles.itemHeader}>
              จำนวน
            </Text>
          </View>
          <View style={styles.row}>
            <Text wrap={false} style={styles.itemHeader}>
              รวม
            </Text>
          </View>
        </View>
        <Divider fixed />
        {products.map((product) => (
          <View key={`${product.key}`} style={styles.itemRow}>
            <View style={styles.row2}>
              <Text style={styles.item}>{`${product.label} (${
                product.method == CashoutMethod.CASH ? "เงินสด" : "โอน"
              })`}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.item}>{money(product.price)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.item}>{number(product.count)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.item}>
                {money(product.price * product.count)}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.itemRow}>
          <View style={styles.row3}>
            <Text style={styles.itemHeader}>รวมเงินสด</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.item}>
              {money(
                products
                  .filter((product) => product.method == CashoutMethod.CASH)
                  .reduce((total, product) => total + product.price, 0)
              )}
            </Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.row3}>
            <Text style={styles.itemHeader}>รวมเงินโอน</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.item}>
              {money(
                products
                  .filter((product) => product.method == CashoutMethod.BANK)
                  .reduce((total, product) => total + product.price, 0)
              )}
            </Text>
          </View>
        </View>
        <View style={styles.itemRow}>
          <View style={styles.row3}>
            <Text style={styles.itemHeader}>ยอดรวม</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.item}>
              {money(
                products.reduce((total, product) => total + product.price, 0)
              )}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DashboardDocument;

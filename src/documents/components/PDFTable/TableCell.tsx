import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { ReactNode } from "react";
import { useTableContext, useTableSectionContext } from "./TableContext";

const styles = StyleSheet.create({
  cell: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  cellText: {
    fontFamily: "Sarabun",
  },
  cellTextBold: {
    fontFamily: "Sarabun Bold",
  },
  alignLeft: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  alignCenter: {
    justifyContent: "center",
    flexDirection: "row",
  },
  alignRight: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
});

interface TableCellProps {
  children: ReactNode;
  colSpan?: number;
  align?: "left" | "center" | "right";
  bold?: boolean;
  style?: Style;
  textStyle?: Style;
  wrap?: boolean;
}

const TableCell = ({
  children,
  colSpan = 1,
  align = "left",
  bold,
  style,
  textStyle,
  wrap = false,
}: TableCellProps) => {
  const { getColumnWidth } = useTableContext();
  const { isInHead, isInFooter } = useTableSectionContext();

  const width = getColumnWidth(colSpan);

  // Auto bold for header cells
  const shouldBeBold = bold ?? (isInHead || isInFooter);

  const alignStyle =
    align === "center"
      ? styles.alignCenter
      : align === "right"
        ? styles.alignRight
        : styles.alignLeft;

  return (
    <View
      style={[styles.cell, alignStyle, { width }, style ?? {}]}
      wrap={false}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text
          wrap={wrap}
          style={[
            shouldBeBold ? styles.cellTextBold : styles.cellText,
            textStyle ?? {},
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

export default TableCell;

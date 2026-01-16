import { StyleSheet, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { ReactNode } from "react";
import { useTableContext, useTableRowContext } from "./TableContext";

const styles = StyleSheet.create({
  tableRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  striped: {
    backgroundColor: "#f5f5f5",
  },
  bordered: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
  },
});

interface TableRowProps {
  children: ReactNode;
  style?: Style;
  fixed?: boolean;
}

const TableRow = ({ children, style, fixed }: TableRowProps) => {
  const { striped, bordered } = useTableContext();
  const { index } = useTableRowContext();

  const isOddRow = index % 2 === 1;

  return (
    <View
      style={[
        styles.tableRow,
        striped && isOddRow ? styles.striped : {},
        bordered ? styles.bordered : {},
        style ?? {},
      ]}
      fixed={fixed}
      wrap={false}
    >
      {children}
    </View>
  );
};

export default TableRow;

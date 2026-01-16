import { StyleSheet, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { ReactNode, useMemo } from "react";
import { TableContext } from "./TableContext";

const styles = StyleSheet.create({
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});

interface TableProps {
  columns: number;
  children: ReactNode;
  style?: Style;
  fixed?: boolean;
  bordered?: boolean;
  striped?: boolean;
}

const Table = ({
  columns,
  children,
  style,
  fixed,
  bordered = false,
  striped = false,
}: TableProps) => {
  const contextValue = useMemo(
    () => ({
      columns,
      getColumnWidth: (colSpan: number = 1) => {
        const percentage = (colSpan / columns) * 100;
        return `${percentage}%`;
      },
      isInHead: false,
      isInFooter: false,
      striped,
      bordered,
    }),
    [columns, striped, bordered]
  );

  return (
    <TableContext.Provider value={contextValue}>
      <View style={[styles.table, style ?? {}]} fixed={fixed}>
        {children}
      </View>
    </TableContext.Provider>
  );
};

export default Table;

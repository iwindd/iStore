import { StyleSheet, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { ReactNode, useMemo } from "react";
import { TableSectionContext } from "./TableContext";

const styles = StyleSheet.create({
  tableFooter: {
    display: "flex",
    flexDirection: "column",
  },
});

interface TableFooterProps {
  children: ReactNode;
  style?: Style;
  fixed?: boolean;
}

const TableFooter = ({ children, style, fixed }: TableFooterProps) => {
  const valueMemo = useMemo(() => ({ isInHead: false, isInFooter: true }), []);

  return (
    <TableSectionContext.Provider value={valueMemo}>
      <View style={[styles.tableFooter, style ?? {}]} fixed={fixed}>
        {children}
      </View>
    </TableSectionContext.Provider>
  );
};

export default TableFooter;

import { StyleSheet, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { ReactNode, useMemo } from "react";
import { TableSectionContext } from "./TableContext";

const styles = StyleSheet.create({
  tableHead: {
    display: "flex",
    flexDirection: "column",
    borderBottom: "1px solid black",
  },
});

interface TableHeadProps {
  children: ReactNode;
  style?: Style;
  fixed?: boolean;
}

const TableHead = ({ children, style, fixed }: TableHeadProps) => {
  const valueMemo = useMemo(() => ({ isInHead: true, isInFooter: false }), []);

  return (
    <TableSectionContext.Provider value={valueMemo}>
      <View style={[styles.tableHead, style ?? {}]} fixed={fixed}>
        {children}
      </View>
    </TableSectionContext.Provider>
  );
};

export default TableHead;

import { StyleSheet, View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
import { Children, ReactNode } from "react";
import { TableRowContext } from "./TableContext";

const styles = StyleSheet.create({
  tableBody: {
    display: "flex",
    flexDirection: "column",
  },
});

interface TableBodyProps {
  children: ReactNode;
  style?: Style;
}

const TableBody = ({ children, style }: TableBodyProps) => {
  return (
    <View style={[styles.tableBody, style ?? {}]}>
      {Children.map(children, (child, index) => (
        <TableRowContext.Provider value={{ index }}>
          {child}
        </TableRowContext.Provider>
      ))}
    </View>
  );
};

export default TableBody;

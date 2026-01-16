import { createContext, useContext } from "react";

interface TableContextValue {
  columns: number;
  getColumnWidth: (colSpan?: number) => string;
  isInHead: boolean;
  isInFooter: boolean;
  striped: boolean;
  bordered: boolean;
}

const TableContext = createContext<TableContextValue | null>(null);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("Table components must be used within a <Table> component");
  }
  return context;
};

interface TableSectionContextValue {
  isInHead: boolean;
  isInFooter: boolean;
}

const TableSectionContext = createContext<TableSectionContextValue>({
  isInHead: false,
  isInFooter: false,
});

export const useTableSectionContext = () => useContext(TableSectionContext);

interface TableRowContextValue {
  index: number;
}

const TableRowContext = createContext<TableRowContextValue>({
  index: 0,
});

export const useTableRowContext = () => useContext(TableRowContext);

export { TableContext, TableRowContext, TableSectionContext };

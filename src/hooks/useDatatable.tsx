import Datatable, { DatatableProps } from "@/components/Datatable";
import { GridValidRowModel } from "@mui/x-data-grid";

const useDatatable = <T extends GridValidRowModel>(
  props: DatatableProps<T>
) => {
  return <Datatable {...props} />;
};

export default useDatatable;

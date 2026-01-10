import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";

export class Colorization {
  static getGridCellColorForQuantity(
    params: GridCellParams<any, any, any, GridTreeNode>
  ) {
    if (params.field != "quantity") return "";

    return params.value <= 0 ? "text-color-error" : "text-color-success";
  }
}

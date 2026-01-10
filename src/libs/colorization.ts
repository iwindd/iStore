import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";
import { StockState } from "@prisma/client";

export class Colorization {
  static getGridCellColorForQuantity(
    params: GridCellParams<any, any, any, GridTreeNode>
  ) {
    if (params.field != "quantity") return "";

    return params.value <= 0 ? "text-color-error" : "text-color-success";
  }

  static getGridCellColorForStockState(
    params: GridCellParams<any, any, any, GridTreeNode>
  ) {
    if (params.field != "state") return "";

    switch (params.value) {
      case StockState.CREATING:
        return "text-color-secondary";
      case StockState.DRAFT:
        return "text-color-secondary";
      case StockState.PROCESSING:
        return "text-color-warning";
      case StockState.COMPLETED:
        return "text-color-success";
      case StockState.CANCEL:
        return "text-color-error";
      default:
        return "text-color-secondary";
    }
  }
}

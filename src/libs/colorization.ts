import { GridCellParams, GridTreeNode } from "@mui/x-data-grid";
import { StockReceiptStatus } from "@prisma/client";

export class Colorization {
  static getGridCellColorForQuantity(
    params: GridCellParams<any, any, any, GridTreeNode>
  ) {
    if (params.field != "quantity") return "";

    return params.value <= 0 ? "text-color-error" : "text-color-success";
  }

  static getGridCellColorForStockReceiptStatus(
    params: GridCellParams<any, any, any, GridTreeNode>
  ) {
    if (params.field != "state") return "";

    switch (params.value) {
      case StockReceiptStatus.CREATING:
        return "text-color-secondary";
      case StockReceiptStatus.DRAFT:
        return "text-color-secondary";
      case StockReceiptStatus.PROCESSING:
        return "text-color-warning";
      case StockReceiptStatus.COMPLETED:
        return "text-color-success";
      case StockReceiptStatus.CANCEL:
        return "text-color-error";
      default:
        return "text-color-secondary";
    }
  }
}

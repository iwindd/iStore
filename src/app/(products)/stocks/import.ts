export enum ImportType {
  FromMinStock,
  FromStockId
}

export interface Import {
  value: ImportType;
  label: string;
}

export const Imports: Import[] = [
  { value: ImportType.FromMinStock, label: "สินค้าที่ต่ำกว่ากำหนด" },
];

export interface ImportFromMinStockPayload{
  type: ImportType.FromMinStock,
  product_min_stock: boolean,
  value?: number
}

export interface ImportFromStockId{
  type: ImportType.FromStockId,
  id: number,
}

export type ImportPayload = ImportFromMinStockPayload | ImportFromStockId

export interface ImportControllerProps{
  payload: ImportPayload | null;
  setPayload: React.Dispatch<React.SetStateAction<ImportPayload | null>>;
}
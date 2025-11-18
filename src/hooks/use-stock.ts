import CommitAction from "@/actions/stock/commit";
import Create from "@/actions/stock/create";
import { StockItem } from "@/atoms/stock";
import { Product } from "@prisma/client";
import { useState } from "react";
import { SetterOrUpdater } from "recoil";

interface StockHook {
  stocks: StockItem[];
  target: number | null;
  addProduct(product: Product, amount: number): void;
  commit(instant?: boolean, note?: string): Promise<boolean>;
  setStocks: SetterOrUpdater<StockItem[]>;
  setTarget: SetterOrUpdater<number | null>;
}

export function useStock(): StockHook {
  // TODO:: use redux instead of recoil;
  const [stocks, setStocks] = useState<any[]>([]);
  const [target, setTarget] = useState<any>(null);

  const addProduct = (product: Product, amount: number) => {
    setStocks((prev) => {
      const getProducts = () => {
        const oldData = stocks.find(
          (product_) => product_.serial == product.serial
        );

        if (oldData) {
          return prev.map((i) =>
            i.serial === product.serial ? { ...i, payload: amount } : i
          );
        } else {
          return [
            ...prev,
            {
              id: product.id,
              serial: product.serial,
              label: product.label,
              stock: product.stock,
              payload: amount,
            },
          ];
        }
      };

      return getProducts().filter((product) => product.payload != 0);
    });
  };

  const create = async (instant?: boolean, note?: string) => {
    try {
      if (stocks.length <= 0) throw Error("no_items");
      const resp = await Create(stocks, instant, note);
      if (!resp.success) throw Error(resp.message);
      setStocks([]);
      setTarget(null);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const update = async (note?: string) => {
    try {
      if (stocks.length <= 0) throw Error("no_items");
      if (!target) throw Error("no_target");
      const resp = await CommitAction(stocks, target, note);
      if (!resp.success) throw Error(resp.message);
      setStocks([]);
      setTarget(null);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const commit = async (instant?: boolean, note?: string) => {
    if (!target) {
      return await create(instant, note);
    } else {
      return await update(note);
    }
  };

  return { stocks, target, addProduct, commit, setStocks, setTarget };
}

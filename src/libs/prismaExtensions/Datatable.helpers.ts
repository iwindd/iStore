import { SortDirection } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { Prisma } from "@prisma/client";

export type SearchMode = "insensitive" | "default";

type SearchLeaf = {
  mode?: Prisma.QueryMode;
};

type SearchableConfig = Record<string, any>;

export class DatatableHelpers {
  /**
   * Build search condition for prisma
   * @param keyword keyword to search
   * @param searchable searchable config
   * @returns search condition
   */
  static buildPrismaSearchOr(
    keyword: string,
    searchable: SearchableConfig,
  ): any[] {
    if (!keyword) return [];

    const results: any[] = [];

    const walk = (node: any, path: string[] = []) => {
      for (const [key, value] of Object.entries(node)) {
        // leaf: { mode: 'insensitive' }
        if (DatatableHelpers.isSearchLeaf(value)) {
          results.push(
            DatatableHelpers.buildCondition([...path, key], keyword, value),
          );
          continue;
        }

        if (typeof value === "object" && value !== null) {
          walk(value, [...path, key]);
        }
      }
    };

    walk(searchable);

    return results;
  }

  static buildPrismaSort(sorts: GridSortModel) {
    const orderBy: Record<string, any>[] = [];

    for (const sort of sorts) {
      const keys = sort.field.split(".");
      const direction = sort.sort as SortDirection;

      let nested: any = {};
      let current = nested;

      for (const [index, key] of keys.entries()) {
        if (index === keys.length - 1) {
          current[key] = direction;
        } else {
          current[key] = {};
          current = current[key];
        }
      }

      orderBy.unshift(nested);
    }

    return orderBy;
  }

  private static isSearchLeaf(value: any): value is SearchLeaf {
    return typeof value === "object" && value !== null && "mode" in value;
  }

  private static buildCondition(
    path: string[],
    keyword: string,
    config: SearchLeaf,
  ) {
    return path.reduceRight((acc, key) => {
      if (acc === null) {
        return {
          [key]: {
            contains: keyword,
            ...(config.mode && { mode: config.mode }),
          },
        };
      }

      return { [key]: acc };
    }, null as any);
  }
}

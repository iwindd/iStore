import { TableFetch } from "@/components/Datatable";
import { Prisma } from "../../../prisma/generated/prisma/client";
import { filter, order } from "../formatter";

export interface DatatableFetchResult<T> {
  data: T[];
  total: number;
}

export const datatableFetchExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "datatableFetch",
    model: {
      $allModels: {
        async datatableFetch<T, A extends Prisma.Args<T, "findMany">>(
          this: T,
          {
            table,
            filter: columnFilter,
            ...args
          }: A & { table: TableFetch; filter?: string[] },
        ) {
          const skip = table.pagination.page * table.pagination.pageSize;
          const take = table.pagination.pageSize;
          const orderBy = order(table.sort);

          const [data, total] = await Promise.all([
            (this as any).findMany({
              skip,
              take,
              ...args,
              orderBy: orderBy.length > 0 ? orderBy : args.orderBy,
              where: {
                ...args.where,
                ...filter(table.filter, columnFilter),
              },
            }),
            (this as any).count({ where: args.where }),
          ]);

          return {
            data,
            total,
          };
        },
      },
    },
  });
});

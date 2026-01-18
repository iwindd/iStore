import { TableFetch } from "@/components/Datatable";
import { Prisma } from "@prisma/client";
import { filter } from "../formatter";
import { DatatableHelpers } from "./Datatable.helpers";

export interface DatatableFetchResult<T> {
  data: T[];
  total: number;
}

export const datatableFetchExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "datatableFetch",
    model: {
      $allModels: {
        /**
         * @deprecated use `getDatatable` instead
         */
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
          const orderBy = DatatableHelpers.buildPrismaSort(table.sort);

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

          console.log(table, columnFilter);

          return {
            data,
            total,
          };
        },
        async getDatatable<T, S extends Prisma.Args<T, "findMany">["select"]>(
          this: T,
          args: {
            select: S;
            searchable?: Prisma.Args<T, "findMany">["where"];
            where?: Prisma.Args<T, "findMany">["where"];
            query: TableFetch;
          },
        ): Promise<{
          total: number;
          data: Prisma.Result<T, { select: S }, "findMany">;
        }> {
          const context = Prisma.getExtensionContext(this) as any;
          const { select, searchable, query } = args;

          const where: Prisma.Args<T, "findMany">["where"] = { AND: [] };
          const skip = query.pagination.page * query.pagination.pageSize;
          const take = query.pagination.pageSize;
          const orderBy = DatatableHelpers.buildPrismaSort(query.sort);

          if (searchable && query?.filter.quickFilterValues) {
            const OR = query.filter.quickFilterValues.flatMap((value) => {
              return DatatableHelpers.buildPrismaSearchOr(value, searchable);
            });

            where.OR = OR;
          }

          if (args?.where) {
            where.AND.push(args.where);
          }

          const data = await context.findMany({
            where,
            skip,
            take,
            orderBy,
            select,
          });

          const count = await context.count({
            where: {
              AND: where.AND,
              OR: where.OR,
            },
          });

          return { data, total: count };
        },
      },
    },
  });
});

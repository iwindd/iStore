import { Prisma } from "@prisma/client";

export interface ResultExtensionResult<T> {
  data: T[];
  total: number;
}

export const resultExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "resultExtension",
    result: {
      user: {
        name: {
          needs: {
            first_name: true,
            last_name: true,
          },
          compute(data) {
            return `${data.first_name} ${data.last_name}`;
          },
        },
      },
    },
  });
});

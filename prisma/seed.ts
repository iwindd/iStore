import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import _ from "lodash";
import orders from "./data/orders.json";
import permissions from "./data/permissions.json";
import products from "./data/products.json";
import stores from "./data/stores.json";

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = "password";

const getOrders = async () => {
  const products = orders.flatMap((order) => order.products);
  const uniqueProductSerials = Array.from(
    new Set(products.map((p) => p.serial))
  );
  const productsInDb = await prisma.product.findMany({
    where: {
      serial: { in: uniqueProductSerials },
    },
    include: {
      category: {
        select: {
          label: true,
        },
      },
    },
  });

  const result = [];

  for (const order of orders) {
    const productsForOrder = productsInDb.filter((product) =>
      order.products.some((p: any) => p.serial === product.serial)
    );

    if (productsForOrder.length === 0) continue;

    result.push({
      id: order.id,
      price: order.price,
      cost: order.cost,
      profit: order.profit,
      method: order.method as any,
      type: order.type as any,
      note: order.note,
      created_at: new Date(order.created_at),
      updated_at: new Date(order.updated_at),
      store_id: order.store_id,
      text: productsForOrder.map((p: any) => p.label).join(", "),
      products: {
        create: productsForOrder.map((product) => {
          const data = order.products.find(
            (p: any) => p.serial === product.serial
          );

          return {
            serial: product.serial,
            label: product.label,
            price: data?.price || product.price,
            cost: data?.cost || product.cost,
            category: product.category?.label || "-",
            count: data?.count || 1,
          };
        }),
      },
    });
  }

  return result;
};

async function main() {
  await prisma.$transaction(async () => {
    for (const permissionName of permissions) {
      await prisma.permission.upsert({
        where: { name: permissionName.toUpperCase() },
        update: {},
        create: {
          name: permissionName.toUpperCase(),
        },
      });
    }
  });

  await prisma.$transaction(async () => {
    const password = await bcrypt.hash(DEFAULT_PASSWORD, 15);
    for (const store of stores) {
      await prisma.store.upsert({
        where: { id: store.id },
        update: {},
        create: {
          id: store.id,
          name: store.name,
          roles: {
            create: store.employees.map(
              (employee: (typeof store.employees)[0]) => ({
                label: employee.label,
                permissions: {
                  connect: employee.permissions.map((permission) => ({
                    name: permission.toUpperCase(),
                  })),
                },
                users: {
                  create: employee.users.map(
                    (user: (typeof employee.users)[0]) => ({
                      user: {
                        create: {
                          email: user.email,
                          name: user.name,
                          password: password,
                        },
                      },
                      store: {
                        connect: { id: store.id },
                      },
                    })
                  ),
                },
              })
            ),
          },
        },
      });
    }
  });

  await prisma.$transaction(async () => {
    for (const category of products) {
      await prisma.category.upsert({
        where: {
          label_store_id: {
            label: category.label,
            store_id: category.store_id,
          },
        },
        update: {},
        create: {
          label: category.label,
          store: {
            connect: { id: category.store_id },
          },
          product: {
            create: category.products.map((product) => ({
              serial: product.serial,
              label: product.label,
              price: product.price,
              cost: product.cost,
              store: {
                connect: { id: category.store_id },
              },
            })),
          },
        },
      });
    }
  });

  const ordersData = await getOrders();

  const chunks = _.chunk(ordersData, 500);

  console.log(
    `Seeding ${ordersData.length} orders in ${chunks.length} chunks...`
  );

  for (const [i, chunk] of chunks.entries()) {
    await prisma.$transaction(async () => {
      for (const order of chunk) {
        const castedOrder = order as any;
        await prisma.order.upsert({
          where: { id: castedOrder.id },
          update: {},
          create: castedOrder,
        });
      }
    });
    console.log(`✅ Seeded chunk ${i + 1}/${chunks.length}`);
  }

  console.log(
    `✅ Seed completed successfully!\n`,
    `--------------------------------\n`,
    `Created ${await prisma.store.count()} stores\n`,
    `Created ${await prisma.permission.count()} permissions\n`,
    `Created ${await prisma.role.count()} roles\n`,
    `Created ${await prisma.user.count()} users (default password: ${DEFAULT_PASSWORD})\n`,
    `Created ${await prisma.product.count()} products\n`,
    `Created ${await prisma.category.count()} categories\n`,
    `Created ${await prisma.order.count()} orders (${await prisma.orderProduct.count()} products)\n`,

    `--------------------------------\n`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

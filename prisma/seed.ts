import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import permissions from "./data/permissions.json";
import stores from "./data/stores.json";

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = "password";

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

  console.log(
    `✅ Seed completed successfully!\n`,
    `--------------------------------\n`,
    `Created ${await prisma.store.count()} stores\n`,
    `Created ${await prisma.permission.count()} permissions\n`,
    `Created ${await prisma.role.count()} roles\n`,
    `Created ${await prisma.user.count()} users (default password: ${DEFAULT_PASSWORD})\n`,
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

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.createMany({
    data: [
      {
        email: "store@gmail.com",
        name: "iStore",
        password: await bcrypt.hash("password", 15),
      },
      {
        email: "employee.store@gmail.com",
        name: "Employee Store",
        password: await bcrypt.hash("password", 15),
      },
    ],
  });
  console.log("Users created:", user);

  const store = await prisma.store.create({
    data: {
      name: "Main Store",
    },
  });
  console.log("Store created:", store);

  const roles = await prisma.role.createMany({
    data: [
      {
        id: 1,
        label: "Admin",
        permission: "-1",
        store_id: store.id,
        is_super_admin: true,
      },
      {
        id: 2,
        label: "Employee",
        permission: ((1n << 64n) - 1n).toString(),
        store_id: store.id,
      },
    ],
  });
  console.log("Roles created:", roles);

  const userStore = await prisma.userStore.createMany({
    data: [
      {
        userId: 1,
        storeId: store.id,
        role_id: 1,
      },
      {
        userId: 2,
        storeId: store.id,
        role_id: 2,
      },
    ],
  });
  console.log("UserStore associations created:", userStore);
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

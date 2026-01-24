import {
  Method,
  OrderType,
  PrismaClient,
  ProductStockMovementType,
} from "@prisma/client";
import bcrypt from "bcrypt";
import _ from "lodash";
import orders from "./data/orders.json";
import permissions from "./data/permissions.json";
import products from "./data/products.json";
import stores from "./data/stores.json";
import th_geographies from "./data/th_geographies.json";
const prisma = new PrismaClient();
const DEFAULT_PASSWORD = "password";

const transactionOptions = {
  maxWait: 60000,
  timeout: 60000,
};

const getOrders = async () => {
  const result = [];

  for (const order of orders) {
    result.push({
      cost: order.cost,
      profit: order.profit,
      total: order.price,
      method: order.method as Method,
      type: order.type as OrderType,
      note: order.note,
      created_at: new Date(order.created_at),
      updated_at: new Date(order.updated_at),
      store: {
        connect: {
          id: order.store_id,
        },
      },
      products: {
        create: order.products.map((product) => {
          return {
            product: {
              connect: {
                serial_store_id: {
                  serial: product.serial,
                  store_id: order.store_id,
                },
              },
            },
            total: product.price,
            profit: product.price - product.cost,
            cost: product.cost,
            count: product.count,
          };
        }),
      },
      productStockMovements: {
        create: [
          ...order.products.map((product) => ({
            type: ProductStockMovementType.ADJUST,
            quantity: product.count,
            quantity_before: 0,
            quantity_after: product.count,
            product: {
              connect: {
                serial_store_id: {
                  serial: product.serial,
                  store_id: order.store_id,
                },
              },
            },
          })),
          ...order.products.map((product) => ({
            type: ProductStockMovementType.SALE,
            quantity: product.count,
            quantity_before: product.count,
            quantity_after: 0,
            product: {
              connect: {
                serial_store_id: {
                  serial: product.serial,
                  store_id: order.store_id,
                },
              },
            },
          })),
        ],
      },
    });
  }

  return result;
};

async function main() {
  console.log("Seeding permissions...");
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

  console.log("Seeding stores...");
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
                employees: {
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
                    }),
                  ),
                },
              }),
            ),
          },
        },
      });
    }
  });

  console.log("Seeding products...");
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
              stock: {
                create: {
                  quantity: 0,
                },
              },
            })),
          },
        },
      });
    }
  });

  console.log("Seeding country...");
  const country = await prisma.country.upsert({
    where: { code: "TH" },
    update: {},
    create: {
      code: "TH",
      name: "ประเทศไทย",
      nameEn: "Thailand",
    },
  });

  console.log("Seeding th geographies...");

  const provinces: {
    code: string;
    name: string;
    nameEn: string;
    geography_id: number;
    districts: {
      code: string;
      name: string;
      nameEn: string;
      subdistricts: {
        code: string;
        name: string;
        nameEn: string;
        zipcode: string | number;
      }[];
    }[];
  }[] = [];

  await prisma.$transaction(async (tx) => {
    for (const geographyData of th_geographies) {
      const geography = await tx.geography.upsert({
        where: {
          code_country_id: {
            code: geographyData.code,
            country_id: country.id,
          },
        },
        update: {},
        create: {
          code: geographyData.code,
          name: geographyData.name,
          nameEn: geographyData.nameEn,
          country: {
            connect: { id: country.id },
          },
        },
      });

      provinces.push(
        ...geographyData.provinces.map((province) => ({
          code: province.code,
          name: province.name,
          nameEn: province.nameEn,
          geography_id: geography.id,
          districts: province.districts,
        })),
      );
    }
  }, transactionOptions);

  console.log("Seeding th provinces...");

  const districts: {
    code: string;
    name: string;
    nameEn: string;
    province_id: number;
    subdistricts: {
      code: string;
      name: string;
      nameEn: string;
      zipcode: string | number;
    }[];
  }[] = [];

  await prisma.$transaction(async (tx) => {
    for (const provinceData of provinces) {
      console.log(`Seeding province ${provinceData.name} [${provinceData.code}]`)
      const province = await tx.province.upsert({
        where: {
          code_geography_id: {
            code: provinceData.code,
            geography_id: provinceData.geography_id,
          },
        },
        update: {},
        create: {
          code: provinceData.code,
          name: provinceData.name,
          nameEn: provinceData.nameEn,
          geography: {
            connect: { id: provinceData.geography_id },
          },
        },
      });

      districts.push(
        ...provinceData.districts.map((district) => ({
          code: district.code,
          name: district.name,
          nameEn: district.nameEn,
          province_id: province.id,
          subdistricts: district.subdistricts,
        })),
      );
    }
  }, transactionOptions);

  console.log("Seeding th districts...");

  const sub_districts: {
    code: string;
    name: string;
    nameEn: string;
    district_id: number;
    zipcode: string | number;
  }[] = [];

  const districtChunks = _.chunk(districts, 100);

  for (const [i, chunk] of districtChunks.entries()) {
    await prisma.$transaction(async (tx) => {
      for (const districtData of chunk) {
        console.log(`[${i}/${districtChunks.length}] Seeding district ${districtData.name} [${districtData.code}]`)
        const district = await tx.district.upsert({
          where: {
            code_province_id: {
              code: districtData.code,
              province_id: districtData.province_id,
            },
          },
          update: {},
          create: {
            code: districtData.code,
            name: districtData.name,
            nameEn: districtData.nameEn,
            province: {
              connect: {id: districtData.province_id},
            },
          },
        });

        sub_districts.push(
          ...districtData.subdistricts.map((sub_district) => ({
            code: sub_district.code,
            name: sub_district.name,
            nameEn: sub_district.nameEn,
            district_id: district.id,
            zipcode: sub_district.zipcode,
          })),
        );
      }
    }, transactionOptions);
  }

  console.log("Seeding th sub-districts...");

  const subDistrictChunks = _.chunk(sub_districts, 100);

  for (const [i, chunk] of subDistrictChunks.entries()) {
    await prisma.$transaction(async (tx) => {
      for (const sub_districtData of chunk) {
        console.log(`[${i}/${subDistrictChunks.length}] Seeding sub-district ${sub_districtData.name} [${sub_districtData.code}]`)
        const sub_district = await tx.subDistrict.upsert({
          where: {
            code_district_id: {
              code: sub_districtData.code,
              district_id: sub_districtData.district_id,
            },
          },
          update: {},
          create: {
            code: sub_districtData.code,
            name: sub_districtData.name,
            nameEn: sub_districtData.nameEn,
            district: {
              connect: {id: sub_districtData.district_id},
            },
            zipcodes: {
              create: {
                code: sub_districtData.zipcode.toString(),
              },
            },
          },
        });
      }
      console.log(`✅ Seeded chunk ${i + 1}/${subDistrictChunks.length}`);
    }, transactionOptions);
  }

  const ordersData = await getOrders();
  const chunks = _.chunk(ordersData, 100);

  console.log(
    `Seeding ${ordersData.length} orders in ${chunks.length} chunks...`,
  );

  for (const [i, chunk] of chunks.entries()) {
    await prisma.$transaction(async () => {
      for (const order of chunk) {
        await prisma.order.create({
          data: {
            ...order,
          },
        });
      }
    }, transactionOptions);
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
    `Created ${await prisma.geography.count()} geographies\n`,
    `Created ${await prisma.province.count()} provinces\n`,
    `Created ${await prisma.district.count()} districts\n`,
    `Created ${await prisma.subDistrict.count()} sub-districts\n`,
    `Created ${await prisma.zipcode.count()} zipcodes\n`,
    `--------------------------------\n`,
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

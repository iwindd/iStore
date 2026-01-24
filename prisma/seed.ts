import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import _ from "lodash";
import permissions from "./data/permissions.json";
import th_geographies from "./data/th_geographies.json";

// ============================================
// Constants & Configuration
// ============================================

const prisma = new PrismaClient();

const TRANSACTION_OPTIONS = {
  maxWait: 60000,
  timeout: 60000,
};

const CHUNK_SIZE = 100;

const OWNER_CONFIG = {
  id: 1,
  email: "owner@gmail.com",
  password: "password",
  first_name: "Owner",
  last_name: "Owner",
} as const;

const COUNTRY_CONFIG = {
  code: "TH",
  name: "ประเทศไทย",
  nameEn: "Thailand",
} as const;

// ============================================
// Types
// ============================================

interface ProvinceData {
  code: string;
  name: string;
  nameEn: string;
  geography_id: number;
  districts: DistrictInput[];
}

interface DistrictData {
  code: string;
  name: string;
  nameEn: string;
  province_id: number;
  subdistricts: SubDistrictInput[];
}

interface SubDistrictData {
  code: string;
  name: string;
  nameEn: string;
  district_id: number;
  zipcode: string | number;
}

interface DistrictInput {
  code: string;
  name: string;
  nameEn: string;
  subdistricts: SubDistrictInput[];
}

interface SubDistrictInput {
  code: string;
  name: string;
  nameEn: string;
  zipcode: string | number;
}

// ============================================
// Utility Functions
// ============================================

const logger = {
  section: (message: string) => console.log(`\n📦 ${message}`),
  item: (message: string) => console.log(`   ├─ ${message}`),
  progress: (current: number, total: number, message: string) =>
    console.log(`   ├─ [${current}/${total}] ${message}`),
  success: (message: string) => console.log(`   ✅ ${message}`),
  summary: (lines: string[]) => {
    console.log("\n" + "═".repeat(40));
    lines.forEach((line) => console.log(`   ${line}`));
    console.log("═".repeat(40) + "\n");
  },
};

async function processInChunks<T>(
  items: T[],
  chunkSize: number,
  processor: (
    chunk: T[],
    chunkIndex: number,
    totalChunks: number,
  ) => Promise<void>,
): Promise<void> {
  const chunks = _.chunk(items, chunkSize);
  for (const [index, chunk] of chunks.entries()) {
    await processor(chunk, index + 1, chunks.length);
  }
}

// ============================================
// Seeders
// ============================================

async function seedPermissions(): Promise<void> {
  logger.section("Seeding permissions...");

  await prisma.$transaction(async (tx) => {
    for (const permission of permissions.GlobalPermission) {
      await tx.globalPermission.upsert({
        where: { name: permission.name },
        update: {},
        create: { name: permission.name },
      });
    }
    logger.item(`Global permissions: ${permissions.GlobalPermission.length}`);

    for (const permission of permissions.StorePermission) {
      await tx.storePermission.upsert({
        where: { name: permission.name },
        update: {},
        create: { name: permission.name },
      });
    }
    logger.item(`Store permissions: ${permissions.StorePermission.length}`);
  });
}

async function seedOwnerRole(): Promise<{ id: number }> {
  logger.section("Seeding owner role...");

  const ownerRole = await prisma.globalRole.upsert({
    where: { id: OWNER_CONFIG.id },
    update: {},
    create: {
      id: OWNER_CONFIG.id,
      label: "Owner",
      is_removable: false,
      permissions: {
        connect: permissions.GlobalPermission.map((p) => ({ name: p.name })),
      },
    },
  });

  logger.item(`Created role: ${ownerRole.label}`);
  return ownerRole;
}

async function seedOwnerUser(roleId: number): Promise<void> {
  logger.section("Seeding owner user...");

  const hashedPassword = await hash(OWNER_CONFIG.password, 15);

  await prisma.user.upsert({
    where: { email: OWNER_CONFIG.email },
    update: {},
    create: {
      email: OWNER_CONFIG.email,
      password: hashedPassword,
      first_name: OWNER_CONFIG.first_name,
      last_name: OWNER_CONFIG.last_name,
      global_role: { connect: { id: roleId } },
    },
  });

  logger.item(`Created user: ${OWNER_CONFIG.email}`);
}

async function seedCountry(): Promise<{ id: number }> {
  logger.section("Seeding country...");

  const country = await prisma.country.upsert({
    where: { code: COUNTRY_CONFIG.code },
    update: {},
    create: {
      code: COUNTRY_CONFIG.code,
      name: COUNTRY_CONFIG.name,
      nameEn: COUNTRY_CONFIG.nameEn,
    },
  });

  logger.item(`Created country: ${country.name} (${country.code})`);
  return country;
}

async function seedGeographies(countryId: number): Promise<ProvinceData[]> {
  logger.section("Seeding geographies...");

  const provinces: ProvinceData[] = [];

  await prisma.$transaction(async (tx) => {
    for (const geoData of th_geographies) {
      const geography = await tx.geography.upsert({
        where: {
          code_country_id: { code: geoData.code, country_id: countryId },
        },
        update: {},
        create: {
          code: geoData.code,
          name: geoData.name,
          nameEn: geoData.nameEn,
          country: { connect: { id: countryId } },
        },
      });

      logger.item(`Geography: ${geography.name}`);

      provinces.push(
        ...geoData.provinces.map((p) => ({
          code: p.code,
          name: p.name,
          nameEn: p.nameEn,
          geography_id: geography.id,
          districts: p.districts,
        })),
      );
    }
  }, TRANSACTION_OPTIONS);

  return provinces;
}

async function seedProvinces(
  provinces: ProvinceData[],
): Promise<DistrictData[]> {
  logger.section("Seeding provinces...");

  const districts: DistrictData[] = [];

  await prisma.$transaction(async (tx) => {
    for (const provinceData of provinces) {
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
          geography: { connect: { id: provinceData.geography_id } },
        },
      });

      districts.push(
        ...provinceData.districts.map((d) => ({
          code: d.code,
          name: d.name,
          nameEn: d.nameEn,
          province_id: province.id,
          subdistricts: d.subdistricts,
        })),
      );
    }
  }, TRANSACTION_OPTIONS);

  logger.item(`Created ${provinces.length} provinces`);
  return districts;
}

async function seedDistricts(
  districts: DistrictData[],
): Promise<SubDistrictData[]> {
  logger.section("Seeding districts...");

  const subDistricts: SubDistrictData[] = [];

  await processInChunks(
    districts,
    CHUNK_SIZE,
    async (chunk, current, total) => {
      await prisma.$transaction(async (tx) => {
        for (const districtData of chunk) {
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
              province: { connect: { id: districtData.province_id } },
            },
          });

          subDistricts.push(
            ...districtData.subdistricts.map((s) => ({
              code: s.code,
              name: s.name,
              nameEn: s.nameEn,
              district_id: district.id,
              zipcode: s.zipcode,
            })),
          );
        }
      }, TRANSACTION_OPTIONS);

      logger.progress(current, total, `Districts chunk completed`);
    },
  );

  logger.success(`Created ${districts.length} districts`);
  return subDistricts;
}

async function seedSubDistricts(
  subDistricts: SubDistrictData[],
): Promise<void> {
  logger.section("Seeding sub-districts...");

  await processInChunks(
    subDistricts,
    CHUNK_SIZE,
    async (chunk, current, total) => {
      await prisma.$transaction(async (tx) => {
        for (const subDistrictData of chunk) {
          await tx.subDistrict.upsert({
            where: {
              code_district_id: {
                code: subDistrictData.code,
                district_id: subDistrictData.district_id,
              },
            },
            update: {},
            create: {
              code: subDistrictData.code,
              name: subDistrictData.name,
              nameEn: subDistrictData.nameEn,
              district: { connect: { id: subDistrictData.district_id } },
              zipcodes: {
                create: { code: subDistrictData.zipcode.toString() },
              },
            },
          });
        }
      }, TRANSACTION_OPTIONS);

      logger.progress(current, total, `Sub-districts chunk completed`);
    },
  );

  logger.success(`Created ${subDistricts.length} sub-districts`);
}

async function printSummary(): Promise<void> {
  const [
    geographyCount,
    provinceCount,
    districtCount,
    subDistrictCount,
    zipcodeCount,
  ] = await Promise.all([
    prisma.geography.count(),
    prisma.province.count(),
    prisma.district.count(),
    prisma.subDistrict.count(),
    prisma.zipcode.count(),
  ]);

  logger.summary([
    `🌍 Geographies: ${geographyCount}`,
    `🏛️  Provinces: ${provinceCount}`,
    `🏘️  Districts: ${districtCount}`,
    `🏠 Sub-districts: ${subDistrictCount}`,
    `📮 Zipcodes: ${zipcodeCount}`,
    ``,
    `🔑 Login: ${OWNER_CONFIG.email} / ${OWNER_CONFIG.password}`,
  ]);
}

// ============================================
// Main Entry Point
// ============================================

async function main(): Promise<void> {
  console.log("🚀 Starting database seed...\n");

  // Seed user & permissions
  await seedPermissions();
  const ownerRole = await seedOwnerRole();
  await seedOwnerUser(ownerRole.id);

  // Seed geography data
  const country = await seedCountry();
  const provinces = await seedGeographies(country.id);
  const districts = await seedProvinces(provinces);
  const subDistricts = await seedDistricts(districts);
  await seedSubDistricts(subDistricts);

  // Print summary
  await printSummary();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

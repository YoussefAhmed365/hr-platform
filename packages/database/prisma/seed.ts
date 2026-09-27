// packages/database/prisma/seed.ts
import 'dotenv/config';
import { PrismaClient, SystemRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. إنشاء حساب الـ Super Admin الرسمي للمنصة
  const superAdmin = await prisma.user.upsert({
    where: { email: 'moamensaleh39@gmail.com' },
    update: {},
    create: {
      email: 'moamensaleh39@gmail.com',
      name: 'Moamen Saleh',
      emailVerified: true,
      role: SystemRole.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`✅ Super Admin ready: ${superAdmin.email}`);

  // 2. إنشاء الباقات المرنة (بدون فروع / بفروع)
  await prisma.saaSPlan.upsert({
    where: { name: 'STARTER_SINGLE' },
    update: {},
    create: {
      name: 'STARTER_SINGLE', // باقة: مدير + موظفون بدون فروع
      hasBranches: false,
      maxBranches: 1,
      maxTotalEmployees: 50,
    },
  });

  await prisma.saaSPlan.upsert({
    where: { name: 'BUSINESS_MULTI_BRANCH' },
    update: {},
    create: {
      name: 'BUSINESS_MULTI_BRANCH', // باقة: شركة بفروع متعددة
      hasBranches: true,
      maxBranches: 10,
      maxEmployeesPerBranch: 100,
      maxTotalEmployees: 500,
    },
  });
  console.log('✅ SaaS Plans seeded.');

  // 3. تغذية قوانين التأمينات الاجتماعية المصرية (قانون 148 لسنة 2019)
  await prisma.globalComplianceRule.upsert({
    where: { category_version: { category: 'INSURANCE', version: 2026 } },
    update: {},
    create: {
      category: 'INSURANCE',
      version: 2026,
      effectiveFrom: new Date('2026-01-01'),
      parameters: {
        employeeSharePercent: 11.0,
        employerSharePercent: 18.75,
        totalPercent: 29.75,
        maxInsurableWage: 16700,
      },
    },
  });

  // 4. تغذية شرائح الضريبة المصرية التصاعدية والإعفاء الشخصي
  await prisma.globalComplianceRule.upsert({
    where: { category_version: { category: 'TAX', version: 2026 } },
    update: {},
    create: {
      category: 'TAX',
      version: 2026,
      effectiveFrom: new Date('2026-01-01'),
      parameters: {
        personalExemptionAnnual: 20000,
        martyrsFundPercent: 0.05,
        brackets: [
          { min: 0, max: 40000, rate: 0 },
          { min: 40000, max: 55000, rate: 10 },
          { min: 55000, max: 70000, rate: 15 },
          { min: 70000, max: 200000, rate: 20 },
          { min: 200000, max: 400000, rate: 22.5 },
          { min: 400000, max: 1200000, rate: 25 },
          { min: 1200000, max: null, rate: 27.5 },
        ],
      },
    },
  });

  // 5. تغذية قواعد قانون العمل المصري (الإجازات والأوفر تايم)
  await prisma.globalComplianceRule.upsert({
    where: { category_version: { category: 'LABOR_LAW', version: 2026 } },
    update: {},
    create: {
      category: 'LABOR_LAW',
      version: 2026,
      effectiveFrom: new Date('2026-01-01'),
      parameters: {
        standardAnnualLeaveDays: 21,
        seniorAnnualLeaveDays: 30,
        seniorityYearsThreshold: 10,
        seniorityAgeThreshold: 50,
        overtimeRates: {
          dayPercent: 135,
          nightPercent: 170,
          restOrHolidayPercent: 200,
        },
      },
    },
  });
  console.log('✅ Egyptian Compliance Rules seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    return;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const { ADMIN_PASSWORD, SALT_ROUNDS } = process.env;
const prisma = new PrismaClient();

async function main() {
  const saltRounds = parseInt(SALT_ROUNDS);
  const adminPassword = await hash(ADMIN_PASSWORD, saltRounds);

  await prisma.users.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

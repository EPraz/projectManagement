import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Upsert: si no existe, crea; si existe, solo actualiza updatedAt automáticamente
  await prisma.dbHeartbeat.upsert({
    where: { id: 1 },
    create: { id: 1, ticks: 1 },
    update: { ticks: { increment: 1 } },
  });

  console.log(`[keepAlive] heartbeat updated at ${new Date().toISOString()}`);
}

main()
  .catch((e) => {
    console.error('[keepAlive] error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

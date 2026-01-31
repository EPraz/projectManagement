import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding minimal data...');

  // USER
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed-password-placeholder',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // PROJECT
  const project = await prisma.project.create({
    data: {
      title: 'Demo Project',
      description: 'Minimal seeded project',
      createdBy: user.id,
      users: { connect: { id: user.id } },
    },
  });

  // STATUSES
  const ticketStatus = await prisma.ticketStatus.create({
    data: {
      name: 'To Do',
      position: 0,
      projectId: project.id,
    },
  });

  const taskStatus = await prisma.taskStatus.create({
    data: {
      name: 'Pending',
      position: 0,
      projectId: project.id,
    },
  });

  const epicStatus = await prisma.epicStatus.create({
    data: {
      name: 'Open',
      position: 0,
      projectId: project.id,
    },
  });

  const featureStatus = await prisma.featureStatus.create({
    data: {
      name: 'Planned',
      position: 0,
      projectId: project.id,
    },
  });

  // EPIC
  const epic = await prisma.epic.create({
    data: {
      title: 'Initial Epic',
      createdBy: user.id,
      projectId: project.id,
      statusId: epicStatus.id,
    },
  });

  // FEATURE
  const feature = await prisma.feature.create({
    data: {
      title: 'Initial Feature',
      createdBy: user.id,
      epicId: epic.id,
      statusId: featureStatus.id,
    },
  });

  // SPRINT
  const sprint = await prisma.sprint.create({
    data: {
      name: 'Sprint 1',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: project.id,
      createdBy: user.id,
    },
  });

  // TICKET
  const ticket = await prisma.ticket.create({
    data: {
      title: 'Initial Ticket',
      createdBy: user.id,
      projectId: project.id,
      featureId: feature.id,
      sprintId: sprint.id,
      statusId: ticketStatus.id,
    },
  });

  // TASK
  await prisma.task.create({
    data: {
      title: 'Initial Task',
      createdBy: user.id,
      ticketId: ticket.id,
      statusId: taskStatus.id,
    },
  });

  // TAG
  const tag = await prisma.tag.create({
    data: { name: 'demo', color: '#6366f1' },
  });

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { tags: { connect: { id: tag.id } } },
  });

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

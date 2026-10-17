import 'dotenv/config';
import {
  PrismaClient,
  Prisma,
  Role,
  GoalStatus,
  RetroCardType,
  TicketPriority,
  TicketType,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { DEMO_USER_ID, DEMO_USER_EMAIL } from '../src/demo/demo.constants';
import {
  defaultEpicStatuses,
  defaultFeatureStatuses,
  defaultTaskStatuses,
  defaultTicketStatuses,
} from '../src/constants/DefaultProjectValues';
import { demoProjects } from './demo-data';

const prisma = new PrismaClient();
const uuid = (value: number) =>
  `d0000000-0000-4000-8000-${String(value).padStart(12, '0')}`;
const now = new Date();
const day = (offset: number) => new Date(now.getTime() + offset * 86400000);
const team: { name: string; role: Role; email: string }[] = [
  { name: 'Demo Visitor', role: 'ADMIN', email: DEMO_USER_EMAIL },
  { name: 'Alex Morgan', role: 'PROJECT_MANAGER', email: 'alex@demo.example' },
  { name: 'Sam Rivera', role: 'PRODUCT_OWNER', email: 'sam@demo.example' },
  { name: 'Jordan Lee', role: 'DEVELOPER', email: 'jordan@demo.example' },
  { name: 'Taylor Chen', role: 'DEVELOPER', email: 'taylor@demo.example' },
  {
    name: 'Casey Park',
    role: 'QUALITY_ASSURANCE',
    email: 'casey@demo.example',
  },
];

async function populate(tx: Prisma.TransactionClient) {
  for (const [index, member] of team.entries()) {
    await tx.user.create({
      data: {
        id: uuid(index + 1),
        ...member,
        password: `disabled:${randomUUID()}`,
        isVerified: true,
        createdAt: day(-35),
      },
    });
  }
  const tags = await Promise.all(
    ['frontend', 'backend', 'accessibility', 'release'].map((name, index) =>
      tx.tag.create({
        data: {
          name,
          color: ['#2196F3', '#4CAF50', '#FF9800', '#673AB7'][index],
        },
      }),
    ),
  );

  for (const [projectIndex, content] of demoProjects.entries()) {
    const project = await tx.project.create({
      data: {
        id: uuid(100 + projectIndex),
        title: content.title,
        description: content.description,
        createdBy: team[1].email,
        updatedBy: team[1].email,
        createdAt: day(-32),
        updatedAt: day(-1),
        users: { connect: team.map((_, index) => ({ id: uuid(index + 1) })) },
      },
    });
    const projectId = project.id;
    await tx.epicStatus.createMany({
      data: defaultEpicStatuses.map((status) => ({ ...status, projectId })),
    });
    await tx.featureStatus.createMany({
      data: defaultFeatureStatuses.map((status) => ({ ...status, projectId })),
    });
    await tx.ticketStatus.createMany({
      data: defaultTicketStatuses.map((status) => ({ ...status, projectId })),
    });
    await tx.taskStatus.createMany({
      data: defaultTaskStatuses.map((status) => ({ ...status, projectId })),
    });
    const epicStatuses = await tx.epicStatus.findMany({ where: { projectId } });
    const featureStatuses = await tx.featureStatus.findMany({
      where: { projectId },
    });
    const ticketStatuses = await tx.ticketStatus.findMany({
      where: { projectId },
    });
    const taskStatuses = await tx.taskStatus.findMany({ where: { projectId } });
    const epics = [] as { id: string }[];
    for (const title of content.epics) {
      epics.push(
        await tx.epic.create({
          data: {
            projectId,
            title,
            description: `Deliver ${title.toLowerCase()} with a clear, accessible experience.`,
            acceptanceCriteria:
              'The workflow is usable with keyboard and mouse and has reviewed acceptance criteria.',
            createdBy: team[2].email,
            createdAt: day(-30),
            updatedAt: day(-2),
            statusId: epicStatuses.find(
              (status) => status.name === 'IN_PROGRESS',
            )!.id,
          },
        }),
      );
    }
    const features = [] as { id: string }[];
    for (const [index, title] of content.features.entries()) {
      features.push(
        await tx.feature.create({
          data: {
            epicId: epics[Math.floor(index / 2)].id,
            title,
            description: `A complete ${title.toLowerCase()} workflow for the upcoming product release.`,
            acceptanceCriteria:
              'The main scenario, error handling and responsive layout have been reviewed.',
            createdBy: team[2].email,
            createdAt: day(-25),
            updatedAt: day(-1),
            statusId: featureStatuses.find(
              (status) =>
                status.name === (index % 2 ? 'PLANNING' : 'IN_PROGRESS'),
            )!.id,
          },
        }),
      );
    }
    const sprints = [] as { id: string }[];
    for (const [index, dates] of [
      [-28, -15],
      [-7, 7],
      [8, 21],
    ].entries()) {
      const sprint = await tx.sprint.create({
        data: {
          projectId,
          name: `Sprint ${index + 1} — ${['Foundation', 'Delivery', 'Launch'][index]}`,
          startDate: day(dates[0]),
          endDate: day(dates[1]),
          createdBy: team[1].email,
          createdAt: day(-32),
        },
      });
      sprints.push(sprint);
      for (const [memberIndex] of team.entries()) {
        await tx.teamMemberCapacity.create({
          data: {
            sprintId: sprint.id,
            userId: uuid(memberIndex + 1),
            capacity: memberIndex === 0 ? 20 : 60,
            daysOff: memberIndex === 4 ? 1 : 0,
            remainingWork: index === 0 ? 0 : 8 + memberIndex * 3,
          },
        });
      }
      for (const [goalIndex, title] of [
        'Deliver the core workflow',
        'Improve quality and accessibility',
      ].entries()) {
        const completed = index === 0 ? 3 : index === 1 ? 2 - goalIndex : 0;
        await tx.sprintGoal.create({
          data: {
            sprintId: sprint.id,
            title,
            description:
              'Ship a useful, reviewed increment with visible acceptance criteria.',
            progress: Math.round((completed / 3) * 100),
            goalsStatus:
              index === 0
                ? GoalStatus.COMPLETED
                : index === 1 && goalIndex === 1
                  ? GoalStatus.AT_RISK
                  : GoalStatus.IN_PROGRESS,
            goalTask: {
              create: [
                'Implement the main scenario',
                'Review edge cases',
                'Run acceptance checks',
              ].map((title, taskIndex) => ({
                title,
                completed: taskIndex < completed,
              })),
            },
          },
        });
      }
      // Retrospectives belong to completed/current work, not a future sprint.
      if (index < 2) {
        for (const [cardIndex, type] of [
          RetroCardType.POSITIVE,
          RetroCardType.NEGATIVE,
          RetroCardType.IMPROVEMENT,
        ].entries()) {
          const likedBy = [uuid(2), uuid(4)].slice(0, cardIndex === 1 ? 1 : 2);
          await tx.retroCard.create({
            data: {
              sprintId: sprint.id,
              authorId: uuid(cardIndex + 2),
              type,
              likedBy,
              likes: likedBy.length,
              content: [
                'Pairing helped us finish the most complex stories.',
                'Late clarification delayed the acceptance review.',
                'Reserve a short daily slot to review blocked work.',
              ][cardIndex],
              timestamp: day(index === 0 ? -15 : -1),
            },
          });
        }
      }
    }
    const tickets = [] as { id: number }[];
    for (const [index, title] of content.tickets.entries()) {
      const sprintIndex =
        index < 6 ? 0 : index < 14 ? 1 : index < 16 ? 2 : null;
      const statusName =
        index < 6
          ? 'COMPLETED'
          : index < 14
            ? [
                'IN_PROGRESS',
                'IN_PROGRESS',
                'BLOCKED',
                'CODE_REVIEW',
                'TESTING',
                'IN_PROGRESS',
                'NEW',
                'OPEN',
              ][index - 6]
            : 'NEW';
      const assigneeIndex = 3 + (index % 3);
      const completed = statusName === 'COMPLETED';
      const started = !['NEW', 'OPEN'].includes(statusName);
      const completedHours = completed ? 12 : started ? 4 : 0;
      const ticket = await tx.ticket.create({
        data: {
          title,
          projectId,
          featureId: features[index % features.length].id,
          sprintId: sprintIndex === null ? null : sprints[sprintIndex].id,
          description: `${title} so the team can deliver a predictable and accessible product experience.`,
          acceptanceCriteria:
            'The main workflow is complete, edge cases are handled, and the change is reviewed.',
          discussion:
            'Keep the first iteration focused and collect feedback during the sprint review.',
          statusId: ticketStatuses.find((status) => status.name === statusName)!
            .id,
          createdBy: team[2].email,
          updatedBy: team[assigneeIndex].email,
          createdAt: day(-24 + index),
          updatedAt: day(index < 6 ? -16 : -1),
          order: index,
          assignedTo: uuid(assigneeIndex + 1),
          type:
            index % 5 === 2
              ? TicketType.BUG_TICKET
              : TicketType.PRODUCT_BACKLOG_ITEM,
          priority: [
            TicketPriority.HIGH,
            TicketPriority.MEDIUM,
            TicketPriority.CRITICAL,
            TicketPriority.LOW,
          ][index % 4],
          storyPoints: [3, 5, 8][index % 3],
          estimatedHours: 12,
          completedHours,
          remainingHours: 12 - completedHours,
          dueDate: day(
            index < 6 ? -15 + index : index < 14 ? index - 5 : 10 + index,
          ),
          isBlocked: statusName === 'BLOCKED',
          blockedBy: statusName === 'BLOCKED' ? tickets[index - 1].id : null,
          additionalDetails:
            'Fictional work item in the shared portfolio demo.',
          designInformation:
            'Follow the existing component library and responsive layout.',
          notes:
            'Use the board, planning view and ticket detail to explore this work item.',
          tags: { connect: [{ id: tags[index % tags.length].id }] },
          tasks: {
            create: ['Implement the workflow', 'Review and verify'].map(
              (taskTitle, taskIndex) => ({
                title: taskTitle,
                description: `${taskTitle} for: ${title}.`,
                createdBy: team[assigneeIndex].email,
                assignedTo: uuid(assigneeIndex + 1),
                statusId: taskStatuses.find(
                  (status) =>
                    status.name ===
                    (completed
                      ? 'DONE'
                      : statusName === 'BLOCKED'
                        ? 'BLOCKED'
                        : started && taskIndex === 0
                          ? 'IN_PROGRESS'
                          : 'TODO'),
                )!.id,
                estimatedHours: 6,
                completedHours: completed
                  ? 6
                  : started && taskIndex === 0
                    ? 4
                    : 0,
                remainingHours: completed
                  ? 0
                  : started && taskIndex === 0
                    ? 2
                    : 6,
              }),
            ),
          },
          pairProgrammingUsers:
            index === 6 || index === 9
              ? { create: [{ userId: uuid(4) }, { userId: uuid(5) }] }
              : undefined,
        },
      });
      tickets.push(ticket);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');
  if (
    args.some((arg) => !['--reset', '--confirm-demo-reset'].includes(arg)) ||
    (reset && !args.includes('--confirm-demo-reset')) ||
    (!reset && args.includes('--confirm-demo-reset'))
  ) {
    throw new Error('Restoration requires --reset --confirm-demo-reset');
  }
  const status = await prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(1761017)`;
      const initialized = await tx.user.findUnique({
        where: { id: DEMO_USER_ID },
      });
      if (reset && !initialized)
        throw new Error('Restoration requires an initialized demo database');
      if (initialized && !reset) return 'unchanged';
      if (reset && initialized) {
        await tx.pairProgramming.deleteMany();
        await tx.goalTask.deleteMany();
        await tx.sprintGoal.deleteMany();
        await tx.teamMemberCapacity.deleteMany();
        await tx.retroCard.deleteMany();
        await tx.task.deleteMany();
        await tx.ticket.updateMany({ data: { blockedBy: null } });
        await tx.ticket.deleteMany();
        await tx.feature.deleteMany();
        await tx.epic.deleteMany();
        await tx.sprint.deleteMany();
        await tx.ticketStatus.deleteMany();
        await tx.taskStatus.deleteMany();
        await tx.featureStatus.deleteMany();
        await tx.epicStatus.deleteMany();
        await tx.project.deleteMany();
        await tx.tag.deleteMany();
        await tx.user.deleteMany();
      }
      if (
        (await tx.user.count()) ||
        (await tx.project.count()) ||
        (await tx.tag.count())
      ) {
        throw new Error(
          'Demo initialization requires an empty application database. Existing data was preserved.',
        );
      }
      await populate(tx);
      return reset ? 'restored' : 'created';
    },
    { timeout: 120000 },
  );
  console.log(
    JSON.stringify({
      status,
      projects: await prisma.project.count(),
      users: await prisma.user.count(),
      tickets: await prisma.ticket.count(),
      tasks: await prisma.task.count(),
      sprints: await prisma.sprint.count(),
    }),
  );
}

async function run() {
  try {
    await main();
  } catch {
    console.error(
      'Demo seed failed. Use an empty dedicated database for initialization; restoration requires --reset --confirm-demo-reset and an existing demo.',
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
void run();

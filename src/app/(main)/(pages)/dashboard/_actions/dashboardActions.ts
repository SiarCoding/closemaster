
'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import type { User, Kpi, Challenge, Goal, Performance, Training, Task, LeaderboardScore } from '@prisma/client';


async function createUser(clerkId: string): Promise<User & { kpi: Kpi | null, challenges: Challenge[], goals: Goal[] }> {
  const clerkUser = await clerkClient.users.getUser(clerkId);

  if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
    throw new Error('Clerk user not found or no email address available');
  }

  const user = await db.user.create({
    data: {
      clerkId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      challenges: {
        create: [],
      },
      kpi: {
        create: {
          salesTarget: 0,
          newCustomers: 0,
          levelProgress: 0,
        },
      },
      goals: {
        create: [],
      },
    },
    include: {
      kpi: true,
      challenges: true,
      goals: true,
    },
  });

  return user;
}

export async function getKpiData() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
    include: {
      kpi: true,
    },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  if (!user.kpi) {
    user.kpi = await db.kpi.create({
      data: {
        userId: user.id,
        salesTarget: 0,
        newCustomers: 0,
        levelProgress: 0,
      },
    });
  }

  return {
    salesTarget: user.kpi.salesTarget,
    newCustomers: user.kpi.newCustomers,
    levelProgress: user.kpi.levelProgress,
    credits: user.credits,
    level: user.level,
  };
}

export async function getChallengesData() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
    include: {
      challenges: true,
    },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  if (user.challenges.length === 0) {
    await db.challenge.createMany({
      data: [
        {
          userId: user.id,
          title: 'Erreiche dein Verkaufsziel',
          description: 'Steigere deine Verkaufszahlen um 10% diese Woche.',
          status: 'Pending',
          rewardPoints: 100,
          difficulty: 'Medium',
        },
        {
          userId: user.id,
          title: 'Neue Kunden gewinnen',
          description: 'Gewinne 5 neue Kunden.',
          status: 'Pending',
          rewardPoints: 50,
          difficulty: 'Easy',
        },
      ],
    });

    user = await db.user.findUnique({
      where: { clerkId },
      include: {
        challenges: true,
      },
    });

    if (!user) {
      throw new Error('Benutzer konnte nicht gefunden werden');
    }
  }

  return user.challenges;
}

export async function updateChallengeStatus(id: number, status: string) {
  const updatedChallenge = await db.challenge.update({
    where: { id },
    data: { status },
  });
  return updatedChallenge;
}

export async function getFeedbacks() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  const feedbacks = await db.coachingSession.findMany({
    where: { userId: user.id, type: 'Feedback' },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  return feedbacks.map((feedback) => ({
    id: feedback.id,
    message: feedback.content,
    timestamp: feedback.createdAt.toISOString(),
  }));
}

export async function postFeedback(message: string) {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  const feedback = await db.coachingSession.create({
    data: {
      userId: user.id,
      type: 'Feedback',
      content: message,
    },
  });

  return {
    id: feedback.id,
    message: feedback.content,
    timestamp: feedback.createdAt.toISOString(),
  };
}

export async function getGoals() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
    include: {
      goals: true,
    },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  if (user.goals.length === 0) {
    await db.goal.create({
      data: {
        userId: user.id,
        title: 'Erhöhe deinen Umsatz um 20%',
        target: 20,
        progress: 0,
      },
    });

    user = await db.user.findUnique({
      where: { clerkId },
      include: {
        goals: true,
      },
    });

    if (!user) {
      throw new Error('Benutzer konnte nicht gefunden werden');
    }
  }

  return user.goals;
}

export async function getPerformances() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  const performances = await db.performance.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  return performances;
}

export async function getTrainings() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  const trainings = await db.training.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return trainings;
}

export async function getTasks() {
  const { userId: clerkId } = auth();

  if (!clerkId) {
    throw new Error('Clerk ID ist erforderlich');
  }

  let user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await createUser(clerkId);
  }

  const tasks = await db.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return tasks;
}

export async function getLeaderboardData() {
  const leaderboard = await db.leaderboardScore.findMany({
    orderBy: { score: 'desc' },
    take: 10,
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return leaderboard;
}
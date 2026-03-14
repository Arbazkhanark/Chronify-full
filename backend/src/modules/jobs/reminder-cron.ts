// src/modules/jobs/reminder-cron.ts
import cron from 'node-cron';
import admin from 'firebase-admin';
import { logger } from 'patal-log';
import { prisma } from '../../config/prisma';

// Firebase Admin init (ek baar)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const messaging = admin.messaging();

cron.schedule('* * * * *', async () => {
  logger.info("[CRON] Checking task reminders...",{
    functionName: "reminder-cron",
    metadata: { timestamp: new Date().toISOString() }
  });

  const now = new Date();

  const reminders = await prisma.taskReminder.findMany({
    where: {
      remindAt: { lte: now },
      sent: false,
    },
    include: {
      task: true,                    // task include karo
      user: {
        include: {
          pushSubscriptions: true,   // ← Yeh sahi hai (plural)
        },
      },
    },
  });

  for (const reminder of reminders) {
    // Token nikalne ka safe tareeka
    const token = reminder.user.pushSubscriptions?.[0]?.token;

    if (!token) {
      logger.warn("No FCM token found for user", { functionName: "reminder-cron", metadata: { userId: reminder.userId } });
      continue;
    }

    const title = reminder.task.title;
    let body = '';

    switch (reminder.type) {
      case 'BEFORE_START':
        body = `${title} 15 minute mein shuru hone wali hai!`;
        break;
      case 'AT_START':
        body = `${title} ab shuru ho gayi hai! Start karo`;
        break;
      // case 'GRACE_PERIOD':
      //   body = `${title} ka grace period chal raha hai`;
      //   break;
      default:
        body = `${title} reminder`;
    }

    try {
      await messaging.send({
        token,
        notification: { title, body },
        data: { taskId: reminder.task.id },
      });

      logger.info("Push notification sent successfully", {
        functionName: "reminder-cron",
        metadata: { userId: reminder.userId, taskId: reminder.task.id },
      });
    } catch (err: any) {
      logger.error("FCM send failed", {
        functionName: "reminder-cron",
        error: err.message,
      });
    }

    // Mark reminder as sent
    await prisma.taskReminder.update({
      where: { id: reminder.id },
      data: { sent: true, sentAt: now },
    });
  }
});



/*
  Warnings:

  - You are about to drop the column `completed` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `doneAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `isDone` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeSlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeTable` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FixedTimeType" AS ENUM ('COLLEGE', 'OFFICE', 'SCHOOL', 'COMMUTE', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT', 'FREE', 'FAMILY', 'HEALTH', 'OTHER');

-- CreateEnum
CREATE TYPE "TimeSlotType" AS ENUM ('TASK', 'FIXED', 'BREAK', 'COMMUTE', 'FREE', 'CLASS', 'STUDY', 'HEALTH', 'PROJECT', 'MEETING', 'WORKOUT', 'MEAL', 'ENTERTAINMENT', 'SLEEP', 'OTHER');

-- CreateEnum
CREATE TYPE "SleepType" AS ENUM ('REGULAR', 'POWER_NAP', 'RECOVERY', 'EARLY', 'LATE');

-- CreateEnum
CREATE TYPE "SleepDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "GoalPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "GoalCategory" AS ENUM ('ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'SKILL_DEVELOPMENT', 'FINANCIAL', 'SOCIAL', 'CREATIVE');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('ACADEMIC', 'PROFESSIONAL', 'HEALTH', 'PERSONAL', 'LEARNING', 'BREAK', 'COMMUTE', 'PROJECT', 'SLEEP');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('BEFORE_START', 'AT_START', 'AFTER_END');

-- AlterEnum
ALTER TYPE "GoalStatus" ADD VALUE 'DELAYED';

-- AlterEnum
ALTER TYPE "Priority" ADD VALUE 'CRITICAL';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskStatus" ADD VALUE 'SKIPPED';
ALTER TYPE "TaskStatus" ADD VALUE 'DELAYED';
ALTER TYPE "TaskStatus" ADD VALUE 'RESCHEDULED';

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSlot" DROP CONSTRAINT "TimeSlot_timeTableId_fkey";

-- DropForeignKey
ALTER TABLE "TimeTable" DROP CONSTRAINT "TimeTable_userId_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "completed",
ADD COLUMN     "category" "GoalCategory" NOT NULL DEFAULT 'ACADEMIC',
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#3B82F6',
ADD COLUMN     "completedHours" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "priority" "GoalPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" "GoalStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "totalHours" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weeklyTarget" INTEGER NOT NULL DEFAULT 5,
ALTER COLUMN "type" SET DEFAULT 'SHORT_TERM';

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "doneAt",
DROP COLUMN "isDone",
DROP COLUMN "note",
ADD COLUMN     "actualDuration" INTEGER,
ADD COLUMN     "category" "TaskCategory" NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#3B82F6',
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "day" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "fixedTimeId" TEXT,
ADD COLUMN     "gracePeriodEndsAt" TIMESTAMP(3),
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFreePeriod" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRescheduled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastStatusUpdateAt" TIMESTAMP(3),
ADD COLUMN     "milestoneId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "rescheduledCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rescheduledDay" TEXT,
ADD COLUMN     "rescheduledToTime" TEXT,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "type" "TimeSlotType" NOT NULL,
ALTER COLUMN "goalId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gracePeriod" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "lastTimetableLockAt" TIMESTAMP(3),
ADD COLUMN     "notifyAtTaskEnd" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyAtTaskStart" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyBeforeTask" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "playSound" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "snoozeUntil" TIMESTAMP(3);

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "TimeSlot";

-- DropTable
DROP TABLE "TimeTable";

-- CreateTable
CREATE TABLE "SleepSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" "SleepDay" NOT NULL,
    "bedtime" TEXT NOT NULL,
    "wakeTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "type" "SleepType" NOT NULL DEFAULT 'REGULAR',
    "notes" TEXT,
    "color" TEXT NOT NULL DEFAULT '#4B5563',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SleepSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "targetDate" TIMESTAMP(3),
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scheduledHours" INTEGER NOT NULL DEFAULT 0,
    "completedHours" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskFeedback" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "focusLevel" INTEGER NOT NULL,
    "completedWell" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedTime" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "days" TEXT[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "type" "FixedTimeType" NOT NULL DEFAULT 'OTHER',
    "color" TEXT NOT NULL DEFAULT '#6B7280',
    "isEditable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreePeriod" (
    "id" TEXT NOT NULL,
    "fixedTimeId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Free Period',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskReminder" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "remindAt" TIMESTAMP(3) NOT NULL,
    "type" "ReminderType" NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'web',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SleepSchedule_userId_idx" ON "SleepSchedule"("userId");

-- CreateIndex
CREATE INDEX "SleepSchedule_day_idx" ON "SleepSchedule"("day");

-- CreateIndex
CREATE INDEX "SleepSchedule_userId_type_idx" ON "SleepSchedule"("userId", "type");

-- CreateIndex
CREATE INDEX "SleepSchedule_userId_day_idx" ON "SleepSchedule"("userId", "day");

-- CreateIndex
CREATE INDEX "Milestone_goalId_idx" ON "Milestone"("goalId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskFeedback_taskId_key" ON "TaskFeedback"("taskId");

-- CreateIndex
CREATE INDEX "FixedTime_userId_idx" ON "FixedTime"("userId");

-- CreateIndex
CREATE INDEX "FreePeriod_fixedTimeId_idx" ON "FreePeriod"("fixedTimeId");

-- CreateIndex
CREATE INDEX "FreePeriod_day_idx" ON "FreePeriod"("day");

-- CreateIndex
CREATE INDEX "TaskReminder_userId_remindAt_idx" ON "TaskReminder"("userId", "remindAt");

-- CreateIndex
CREATE INDEX "TaskReminder_sent_idx" ON "TaskReminder"("sent");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_userId_key" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Goal_status_idx" ON "Goal"("status");

-- CreateIndex
CREATE INDEX "Goal_targetDate_idx" ON "Goal"("targetDate");

-- CreateIndex
CREATE INDEX "Goal_category_idx" ON "Goal"("category");

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");

-- CreateIndex
CREATE INDEX "Task_day_idx" ON "Task"("day");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_startTime_idx" ON "Task"("startTime");

-- CreateIndex
CREATE INDEX "Task_goalId_idx" ON "Task"("goalId");

-- CreateIndex
CREATE INDEX "Task_fixedTimeId_idx" ON "Task"("fixedTimeId");

-- AddForeignKey
ALTER TABLE "SleepSchedule" ADD CONSTRAINT "SleepSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_fixedTimeId_fkey" FOREIGN KEY ("fixedTimeId") REFERENCES "FixedTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskFeedback" ADD CONSTRAINT "TaskFeedback_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskFeedback" ADD CONSTRAINT "TaskFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedTime" ADD CONSTRAINT "FixedTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreePeriod" ADD CONSTRAINT "FreePeriod_fixedTimeId_fkey" FOREIGN KEY ("fixedTimeId") REFERENCES "FixedTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReminder" ADD CONSTRAINT "TaskReminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReminder" ADD CONSTRAINT "TaskReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

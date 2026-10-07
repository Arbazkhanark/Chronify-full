/*
  Warnings:

  - A unique constraint covering the columns `[userId,day]` on the table `SleepSchedule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SleepSchedule_userId_day_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;

-- CreateIndex
CREATE INDEX "Goal_userId_status_priority_idx" ON "Goal"("userId", "status", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "SleepSchedule_userId_day_key" ON "SleepSchedule"("userId", "day");

-- CreateIndex
CREATE INDEX "Task_userId_day_status_idx" ON "Task"("userId", "day", "status");

-- CreateIndex
CREATE INDEX "Task_userId_completedAt_idx" ON "Task"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "Task_userId_updatedAt_idx" ON "Task"("userId", "updatedAt");

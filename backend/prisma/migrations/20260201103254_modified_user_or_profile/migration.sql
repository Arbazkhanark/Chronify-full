/*
  Warnings:

  - You are about to drop the column `dailyTargetMinutes` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudyIntensity" AS ENUM ('LIGHT', 'MEDIUM', 'HARD', 'EXTREME');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "dailyTargetMinutes",
DROP COLUMN "field",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userName_key" ON "Profile"("userName");

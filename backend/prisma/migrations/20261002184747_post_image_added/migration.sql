-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image" TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

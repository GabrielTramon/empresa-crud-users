-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_createdById_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedById" TEXT,
ADD COLUMN     "updatedByID" TEXT;

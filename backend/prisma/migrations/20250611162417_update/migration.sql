/*
  Warnings:

  - You are about to drop the column `birthDate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[national]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthdate` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `national` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_nationalId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthDate",
DROP COLUMN "nationalId",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "national" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_national_key" ON "users"("national");

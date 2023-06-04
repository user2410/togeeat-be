/*
  Warnings:

  - Added the required column `ownerId` to the `matchings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matchings" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "matchings" ADD CONSTRAINT "matchings_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

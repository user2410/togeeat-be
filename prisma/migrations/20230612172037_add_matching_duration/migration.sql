/*
  Warnings:

  - You are about to drop the column `status` on the `matchings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "matchings" DROP COLUMN "status",
ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "matching_date" DROP NOT NULL,
ALTER COLUMN "matching_date" DROP DEFAULT;

-- DropEnum
DROP TYPE "MatchingStatus";

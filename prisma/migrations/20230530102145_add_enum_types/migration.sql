/*
  Warnings:

  - The `status` column on the `matching_status` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `matching_type` column on the `matching_status` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MatchingStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "MatchingType" AS ENUM ('QUICK', 'YOTEI');

-- AlterTable
ALTER TABLE "matching_status" DROP COLUMN "status",
ADD COLUMN     "status" "MatchingStatus" NOT NULL DEFAULT 'OPEN',
DROP COLUMN "matching_type",
ADD COLUMN     "matching_type" "MatchingType" NOT NULL DEFAULT 'QUICK';

/*
  Warnings:

  - You are about to drop the column `accountId` on the `user_information` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_information" DROP CONSTRAINT "user_information_accountId_fkey";

-- DropIndex
DROP INDEX "user_information_accountId_key";

-- AlterTable
ALTER TABLE "user_information" DROP COLUMN "accountId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "user_information_id_seq";

-- AddForeignKey
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_id_fkey" FOREIGN KEY ("id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

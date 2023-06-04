/*
  Warnings:

  - You are about to drop the column `user_id` on the `accounts` table. All the data in the column will be lost.
  - The primary key for the `user_information` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user_information` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `user_information` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `user_information` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "account_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "review_user" DROP CONSTRAINT "review_user_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "review_user" DROP CONSTRAINT "review_user_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "user_hobbies" DROP CONSTRAINT "user_hobbies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_matching" DROP CONSTRAINT "user_matching_user_id_fkey";

-- DropIndex
DROP INDEX "account_user_id_key";

-- AlterTable
ALTER TABLE "accounts" RENAME CONSTRAINT "account_pkey" TO "accounts_pkey";
ALTER TABLE "accounts" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "matchings" RENAME CONSTRAINT "matching_status_pkey" TO "matchings_pkey";

-- AlterTable
ALTER TABLE "user_information" DROP CONSTRAINT "user_information_pkey";
ALTER TABLE "user_information" DROP COLUMN "user_id";
ALTER TABLE "user_information" ADD COLUMN     "accountId" INTEGER NOT NULL;
ALTER TABLE "user_information" ADD COLUMN     "id" SERIAL NOT NULL;
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_information_accountId_key" ON "user_information"("accountId");

-- AddForeignKey
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matching" ADD CONSTRAINT "user_matching_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "user_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "user_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hobbies" ADD CONSTRAINT "user_hobbies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "user_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "user_information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "account_email_key" RENAME TO "accounts_email_key";

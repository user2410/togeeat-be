/*
  Warnings:

  - You are about to drop the column `conversation_topics` on the `matchings` table. All the data in the column will be lost.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updated_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `user1_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `user2_id` on the `messages` table. All the data in the column will be lost.
  - The `id` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `parent_comment_id` on the `review_user` table. All the data in the column will be lost.
  - You are about to drop the `direct_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `group_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE');

-- DropForeignKey
ALTER TABLE "direct_images" DROP CONSTRAINT "direct_images_message_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "review_user" DROP CONSTRAINT "review_user_parent_comment_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
DROP COLUMN "updated_at",
DROP COLUMN "user1_id",
DROP COLUMN "user2_id",
ADD COLUMN     "content_type" "MessageType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "group_id" UUID NOT NULL,
ADD COLUMN     "sender_id" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT (gen_random_uuid()),
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "review_user" DROP COLUMN "parent_comment_id";

-- DropTable
DROP TABLE "direct_images";

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL DEFAULT (gen_random_uuid()),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "is_group" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_seen_messages" (
    "user_id" INTEGER NOT NULL,
    "message_id" UUID NOT NULL,

    CONSTRAINT "user_seen_messages_pkey" PRIMARY KEY ("user_id","message_id")
);

-- CreateTable
CREATE TABLE "_GroupToUserInformation" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToUserInformation_AB_unique" ON "_GroupToUserInformation"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToUserInformation_B_index" ON "_GroupToUserInformation"("B");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_seen_messages" ADD CONSTRAINT "user_seen_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_seen_messages" ADD CONSTRAINT "user_seen_messages_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUserInformation" ADD CONSTRAINT "_GroupToUserInformation_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUserInformation" ADD CONSTRAINT "_GroupToUserInformation_B_fkey" FOREIGN KEY ("B") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

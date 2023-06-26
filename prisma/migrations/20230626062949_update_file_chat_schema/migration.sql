/*
  Warnings:

  - You are about to drop the column `file_ext` on the `files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_name]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "file_ext";

-- CreateIndex
CREATE UNIQUE INDEX "files_file_name_key" ON "files"("file_name");

-- CreateIndex
CREATE INDEX "groups_createdAt_idx" ON "groups"("createdAt");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

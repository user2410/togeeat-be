/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `hobbies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "hobbies_name_key" ON "hobbies"("name");

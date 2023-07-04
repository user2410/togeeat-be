/*
  Warnings:

  - You are about to drop the `_GroupToUserInformation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `owner_id` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_GroupToUserInformation" DROP CONSTRAINT "_GroupToUserInformation_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUserInformation" DROP CONSTRAINT "_GroupToUserInformation_B_fkey";

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "owner_id" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT (gen_random_uuid());

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "id" SET DEFAULT (gen_random_uuid());

-- DropTable
DROP TABLE "_GroupToUserInformation";

-- CreateTable
CREATE TABLE "users_groups" (
    "group_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "users_groups_pkey" PRIMARY KEY ("group_id","user_id")
);

-- CreateIndex
CREATE INDEX "groups_name_idx" ON "groups"("name");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_groups" ADD CONSTRAINT "users_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

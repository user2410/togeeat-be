/*
  Warnings:

  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `matching_status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
-- ALTER TABLE "account" DROP CONSTRAINT "account_user_id_fkey";

-- DropForeignKey
-- ALTER TABLE "user_matching" DROP CONSTRAINT "user_matching_matching_id_fkey";

-- DropTable
-- DROP TABLE "account";

-- DropTable
-- DROP TABLE "matching_status";

-- CreateTable
-- CREATE TABLE "accounts" (
    -- "id" SERIAL NOT NULL,
    -- "user_id" INTEGER NOT NULL,
    -- "email" TEXT NOT NULL,
    -- "password" TEXT NOT NULL,
    -- "is_admin" BOOLEAN NOT NULL DEFAULT false,
    -- "is_banned" BOOLEAN NOT NULL DEFAULT false,
    -- "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- "updated_at" TIMESTAMP(3) NOT NULL,

    -- CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
-- );

-- CreateTable
-- CREATE TABLE "matchings" (
    -- "id" SERIAL NOT NULL,
    -- "status" "MatchingStatus" NOT NULL DEFAULT 'OPEN',
    -- "address" TEXT NOT NULL DEFAULT '',
    -- "matching_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- "desired_food" TEXT NOT NULL DEFAULT '',
    -- "conversation_topics" TEXT NOT NULL DEFAULT '',
    -- "matching_type" "MatchingType" NOT NULL DEFAULT 'QUICK',
    -- "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- "updated_at" TIMESTAMP(3) NOT NULL,

    -- CONSTRAINT "matchings_pkey" PRIMARY KEY ("id")
-- );

-- CreateIndex
-- CREATE UNIQUE INDEX "accounts_user_id_key" ON "accounts"("user_id");

-- CreateIndex
-- CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- AddForeignKey
-- ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- ALTER TABLE "user_matching" ADD CONSTRAINT "user_matching_matching_id_fkey" FOREIGN KEY ("matching_id") REFERENCES "matchings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameTable
ALTER TABLE "account" RENAME TO "accounts";

-- RenameTable
ALTER TABLE "matching_status" RENAME TO "matchings";
-- DropForeignKey
ALTER TABLE "direct_images" DROP CONSTRAINT "direct_images_message_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "review_user" DROP CONSTRAINT "review_user_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "review_user" DROP CONSTRAINT "review_user_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "user_hobbies" DROP CONSTRAINT "user_hobbies_hobby_id_fkey";

-- DropForeignKey
ALTER TABLE "user_hobbies" DROP CONSTRAINT "user_hobbies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_information" DROP CONSTRAINT "user_information_accountId_fkey";

-- DropForeignKey
ALTER TABLE "user_matching" DROP CONSTRAINT "user_matching_matching_id_fkey";

-- DropForeignKey
ALTER TABLE "user_matching" DROP CONSTRAINT "user_matching_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_information" ADD CONSTRAINT "user_information_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matching" ADD CONSTRAINT "user_matching_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matching" ADD CONSTRAINT "user_matching_matching_id_fkey" FOREIGN KEY ("matching_id") REFERENCES "matchings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hobbies" ADD CONSTRAINT "user_hobbies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hobbies" ADD CONSTRAINT "user_hobbies_hobby_id_fkey" FOREIGN KEY ("hobby_id") REFERENCES "hobbies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "user_information"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_images" ADD CONSTRAINT "direct_images_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

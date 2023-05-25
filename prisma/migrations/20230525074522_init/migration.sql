-- CreateTable
CREATE TABLE "user_information" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "age" INTEGER NOT NULL DEFAULT 18,
    "description" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "background_image" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "nationality" TEXT NOT NULL DEFAULT '',
    "language_skills" TEXT NOT NULL DEFAULT '',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_information_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matching_status" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL DEFAULT '',
    "matching_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "desired_food" TEXT NOT NULL DEFAULT '',
    "conversation_topics" TEXT NOT NULL DEFAULT '',
    "matching_type" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matching_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_matching" (
    "user_id" INTEGER NOT NULL,
    "matching_id" INTEGER NOT NULL,

    CONSTRAINT "user_matching_pkey" PRIMARY KEY ("user_id","matching_id")
);

-- CreateTable
CREATE TABLE "review_user" (
    "comment_id" SERIAL NOT NULL,
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "parent_comment_id" INTEGER,
    "content" TEXT NOT NULL,
    "star" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_user_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "user_hobbies" (
    "user_id" INTEGER NOT NULL,
    "hobby_id" INTEGER NOT NULL,

    CONSTRAINT "user_hobbies_pkey" PRIMARY KEY ("user_id","hobby_id")
);

-- CreateTable
CREATE TABLE "hobbies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "user1_id" INTEGER NOT NULL,
    "user2_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direct_images" (
    "id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "image_link" TEXT NOT NULL,

    CONSTRAINT "direct_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_user_id_key" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matching" ADD CONSTRAINT "user_matching_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_matching" ADD CONSTRAINT "user_matching_matching_id_fkey" FOREIGN KEY ("matching_id") REFERENCES "matching_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_user" ADD CONSTRAINT "review_user_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "review_user"("comment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hobbies" ADD CONSTRAINT "user_hobbies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_hobbies" ADD CONSTRAINT "user_hobbies_hobby_id_fkey" FOREIGN KEY ("hobby_id") REFERENCES "hobbies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "user_information"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_images" ADD CONSTRAINT "direct_images_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

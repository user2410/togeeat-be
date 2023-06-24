-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_ext" TEXT NOT NULL,
    "encoding" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

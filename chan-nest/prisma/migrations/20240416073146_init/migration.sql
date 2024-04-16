-- CreateEnum
CREATE TYPE "PostState" AS ENUM ('ORIGINAL', 'EDITED');

-- CreateTable
CREATE TABLE "Post" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "post_state" "PostState" NOT NULL DEFAULT 'ORIGINAL',
    "writer_id" TEXT NOT NULL,
    "created_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `post_id` on the `media_in_post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[media_in_post_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `media_in_post_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `media_in_post` DROP FOREIGN KEY `media_in_post_post_id_fkey`;

-- AlterTable
ALTER TABLE `media_in_post` DROP COLUMN `post_id`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `media_in_post_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `posts_media_in_post_id_key` ON `posts`(`media_in_post_id`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_media_in_post_id_fkey` FOREIGN KEY (`media_in_post_id`) REFERENCES `media_in_post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `media_in_post_id` on the `posts` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `media_in_post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_media_in_post_id_fkey`;

-- AlterTable
ALTER TABLE `media_in_post` ADD COLUMN `post_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `media_in_post_id`;

-- AddForeignKey
ALTER TABLE `media_in_post` ADD CONSTRAINT `media_in_post_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

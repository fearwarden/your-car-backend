/*
  Warnings:

  - You are about to drop the column `price_id` on the `posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[post_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `post_id` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `media_in_post` DROP FOREIGN KEY `media_in_post_media_id_fkey`;

-- DropForeignKey
ALTER TABLE `media_in_post` DROP FOREIGN KEY `media_in_post_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_price_id_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `price_id`;

-- AlterTable
ALTER TABLE `prices` ADD COLUMN `post_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prices_post_id_key` ON `prices`(`post_id`);

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_in_post` ADD CONSTRAINT `media_in_post_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `medias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_in_post` ADD CONSTRAINT `media_in_post_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

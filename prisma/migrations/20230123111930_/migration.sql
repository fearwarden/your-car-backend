/*
  Warnings:

  - You are about to drop the column `post_id` on the `prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[price_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_post_id_fkey`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `price_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `prices` DROP COLUMN `post_id`;

-- CreateIndex
CREATE UNIQUE INDEX `posts_price_id_key` ON `posts`(`price_id`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_price_id_fkey` FOREIGN KEY (`price_id`) REFERENCES `prices`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `postId` on the `cars` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[carId]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cars` DROP FOREIGN KEY `cars_postId_fkey`;

-- AlterTable
ALTER TABLE `cars` DROP COLUMN `postId`;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `carId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `posts_carId_key` ON `posts`(`carId`);

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `cars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

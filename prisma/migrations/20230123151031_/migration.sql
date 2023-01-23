/*
  Warnings:

  - You are about to drop the column `carId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `car_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_carId_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `carId`,
    ADD COLUMN `car_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_car_id_fkey` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

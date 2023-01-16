/*
  Warnings:

  - You are about to drop the column `carId` on the `prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[post_id]` on the table `prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prices` DROP FOREIGN KEY `prices_carId_fkey`;

-- AlterTable
ALTER TABLE `cars` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `prices` DROP COLUMN `carId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `post_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Media` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_in_post` (
    `post_id` VARCHAR(191) NOT NULL,
    `media_id` VARCHAR(191) NOT NULL,
    `priority` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `media_in_post_post_id_key`(`post_id`),
    UNIQUE INDEX `media_in_post_media_id_key`(`media_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `prices_post_id_key` ON `prices`(`post_id`);

-- AddForeignKey
ALTER TABLE `prices` ADD CONSTRAINT `prices_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_in_post` ADD CONSTRAINT `media_in_post_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_in_post` ADD CONSTRAINT `media_in_post_media_id_fkey` FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

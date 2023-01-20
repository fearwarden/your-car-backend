/*
  Warnings:

  - You are about to drop the column `country` on the `cars` table. All the data in the column will be lost.
  - Added the required column `horse_power` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cars` DROP COLUMN `country`,
    ADD COLUMN `horse_power` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `country` VARCHAR(191) NOT NULL;

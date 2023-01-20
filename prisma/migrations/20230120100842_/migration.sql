/*
  Warnings:

  - You are about to drop the column `mileage` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `cars` table. All the data in the column will be lost.
  - Added the required column `model` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mileage` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cars` DROP COLUMN `mileage`,
    DROP COLUMN `name`,
    DROP COLUMN `year`,
    ADD COLUMN `model` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `mileage` VARCHAR(191) NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

/*
  Warnings:

  - You are about to drop the `specifications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `body_type` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drivetrain` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engine` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exterior_color` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuel_type` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interior_color` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mileage` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fixed` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `specifications` DROP FOREIGN KEY `specifications_carId_fkey`;

-- AlterTable
ALTER TABLE `cars` ADD COLUMN `body_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `drivetrain` VARCHAR(191) NOT NULL,
    ADD COLUMN `engine` VARCHAR(191) NOT NULL,
    ADD COLUMN `exterior_color` VARCHAR(191) NOT NULL,
    ADD COLUMN `fuel_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `interior_color` VARCHAR(191) NOT NULL,
    ADD COLUMN `mileage` VARCHAR(191) NOT NULL,
    ADD COLUMN `transmission` VARCHAR(191) NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `prices` ADD COLUMN `fixed` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `specifications`;
